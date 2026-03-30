import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class DynamicTableControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
            // ── DOM ──────────────────────────────────────────────────────────────────
        private _container: HTMLDivElement;

        // ── PCF context ──────────────────────────────────────────────────────────
        private _context: ComponentFramework.Context<IInputs>;
        private _notifyOutputChanged: () => void;

        // ── State ─────────────────────────────────────────────────────────────────
        private _currentPage = 0;
        private _pageSize= 10;
        private _sortColumn = "";
        private _sortAscending = true;
        private _searchText = "";

        // All record IDs after the dataset has fully loaded
        private _allRowIds: string[] = [];

    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        // Add control initialization code
            this._context = context;
            this._notifyOutputChanged = notifyOutputChanged;
            this._container = container;
            this._container.className = "dtc-wrapper";

            // Read initial page size from the input property (default 10)
            this._pageSize = (context.parameters.pageSize?.raw as number) ?? 10;
            if (this._pageSize < 1) this._pageSize = 10;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        this._context = context;

    const dataset = context.parameters.sampleDataSet;

    // ── Guard: wait for data ──────────────────────────────────────────────
    if (dataset.loading) {
      this._renderLoading();
      return;
    }

    // ── Load all pages if dataset is paged ────────────────────────────────
    // Power Apps pages dataset records by default (5000/page).
    // For small datasets we load all pages so we can do client-side sort/search.
    if (dataset.paging.hasNextPage) {
      dataset.paging.loadNextPage();
      return;
    }

    // ── Update state ──────────────────────────────────────────────────────
    this._pageSize = (context.parameters.pageSize?.raw as number) ?? 10;
    if (this._pageSize < 1) this._pageSize = 10;

    this._allRowIds = dataset.sortedRecordIds;

    // ── Discover columns dynamically from metadata ────────────────────────
    const columns = dataset.columns
      .filter(c => !c.isHidden)
      .sort((a, b) => a.order - b.order);

    // ── Render ────────────────────────────────────────────────────────────
    this._container.innerHTML = "";
    this._container.appendChild(this._buildToolbar(dataset, columns));
    this._container.appendChild(this._buildTable(dataset, columns));
    this._container.appendChild(this._buildPagination());
    }

    // ════════════════════════════════════════════════════════════════════════
  //  RENDER: Loading spinner
  // ════════════════════════════════════════════════════════════════════════
  private _renderLoading(): void {
    this._container.innerHTML = "";
    const div = document.createElement("div");
    div.className = "dtc-loading";
    div.textContent = "Loading data…";
    this._container.appendChild(div);
  }

  // ════════════════════════════════════════════════════════════════════════
  //  RENDER: Toolbar (search input + column count badge)
  // ════════════════════════════════════════════════════════════════════════
  private _buildToolbar(
    dataset: ComponentFramework.PropertyTypes.DataSet,
    columns: ComponentFramework.PropertyHelper.DataSetApi.Column[]
  ): HTMLElement {
    const bar = document.createElement("div");
    bar.className = "dtc-toolbar";

    // Search input
    const search = document.createElement("input");
    search.type = "text";
    search.className = "dtc-search";
    search.placeholder = `Search ${this._allRowIds.length} record${this._allRowIds.length !== 1 ? "s" : ""}…`;
    search.value = this._searchText;
    search.addEventListener("input", (e) => {
      this._searchText = (e.target as HTMLInputElement).value.toLowerCase().trim();
      this._currentPage = 0;               // reset to first page on new search
      this.updateView(this._context);
    });

    // Column count info
    const info = document.createElement("span");
    info.className = "dtc-toolbar-info";
    info.textContent = `${columns.length} column${columns.length !== 1 ? "s" : ""}`;

    bar.appendChild(search);
    bar.appendChild(info);
    return bar;
  }

  // ════════════════════════════════════════════════════════════════════════
  //  RENDER: Dynamic Table
  //  ─ Reads ALL columns from metadata at runtime (no hardcoding)
  //  ─ Client-side search across all formatted values
  //  ─ Client-side sort on any column
  //  ─ Client-side pagination
  //  ─ Type-aware cell rendering (badge, numeric alignment, etc.)
  // ════════════════════════════════════════════════════════════════════════
  private _buildTable(
    dataset: ComponentFramework.PropertyTypes.DataSet,
    columns: ComponentFramework.PropertyHelper.DataSetApi.Column[]
  ): HTMLElement {

    const scrollWrapper = document.createElement("div");
    scrollWrapper.className = "dtc-scroll";

    // ── 1. Filter rows by search text ─────────────────────────────────────
    const filtered: string[] = this._allRowIds.filter(id => {
      if (!this._searchText) return true;
      const record = dataset.records[id];
      return columns.some(col => {
        const val = record.getFormattedValue(col.name) ?? "";
        return val.toLowerCase().includes(this._searchText);
      });
    });

    // ── 2. Sort filtered rows ─────────────────────────────────────────────
    const sorted = [...filtered].sort((a, b) => {
      if (!this._sortColumn) return 0;
      const valA = dataset.records[a].getFormattedValue(this._sortColumn) ?? "";
      const valB = dataset.records[b].getFormattedValue(this._sortColumn) ?? "";
      const cmp = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: "base" });
      return this._sortAscending ? cmp : -cmp;
    });

    // Update stored total for pagination
    const totalFiltered = sorted.length;

    // ── 3. Paginate ───────────────────────────────────────────────────────
    const start = this._currentPage * this._pageSize;
    const paged = sorted.slice(start, start + this._pageSize);

    // ── Empty state ───────────────────────────────────────────────────────
    if (paged.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dtc-no-data";
      empty.textContent = this._searchText
        ? `No records match "${this._searchText}".`
        : "No records found in this view.";
      scrollWrapper.appendChild(empty);
      return scrollWrapper;
    }

    // ── 4. Build <table> ──────────────────────────────────────────────────
    const table = document.createElement("table");
    table.className = "dtc-table";

    // ── 4a. Header row — dynamic columns ─────────────────────────────────
    const thead = table.createTHead();
    const hrow = thead.insertRow();

    columns.forEach(col => {
      const th = document.createElement("th");

      // Sort indicator
      let arrow = " ⇅";
      if (this._sortColumn === col.name) {
        arrow = this._sortAscending ? " ▲" : " ▼";
        th.classList.add(this._sortAscending ? "dtc-sorted-asc" : "dtc-sorted-desc");
      }
      th.textContent = col.displayName + arrow;
      th.title = `Sort by ${col.displayName}`;

      // Sort on click
      th.addEventListener("click", () => {
        if (this._sortColumn === col.name) {
          this._sortAscending = !this._sortAscending;
        } else {
          this._sortColumn = col.name;
          this._sortAscending = true;
        }
        this.updateView(this._context);
      });

      hrow.appendChild(th);
    });

    // Action column header
    const actionTh = document.createElement("th");
    actionTh.textContent = "Actions";
    actionTh.style.cursor = "default";
    hrow.appendChild(actionTh);

    // ── 4b. Data rows ─────────────────────────────────────────────────────
    const tbody = table.createTBody();

    paged.forEach(id => {
      const record = dataset.records[id];
      const row = tbody.insertRow();

      // Row click → open record in Power Apps
      row.addEventListener("click", () => {
        dataset.openDatasetItem(record.getNamedReference());
      });

      // Render each column cell
      columns.forEach(col => {
        const td = row.insertCell();
        const rawValue = record.getValue(col.name);
        const formattedValue = record.getFormattedValue(col.name) ?? "";

        // ── Type-aware rendering ──────────────────────────────────────────
        switch (true) {

          case col.dataType === "TwoOptions": {
            // Boolean → green/red badge
            const badge = document.createElement("span");
            badge.className = `dtc-badge ${rawValue ? "dtc-badge-true" : "dtc-badge-false"}`;
            badge.textContent = formattedValue || (rawValue ? "Yes" : "No");
            td.appendChild(badge);
            break;
          }

          case col.dataType === "OptionSet":
          case col.dataType === "MultiSelectOptionSet": {
            // Option set → blue badge
            const badge = document.createElement("span");
            badge.className = "dtc-badge dtc-badge-option";
            badge.textContent = formattedValue;
            td.appendChild(badge);
            break;
          }

          case col.dataType.startsWith("Whole"):
          case col.dataType.startsWith("Decimal"):
          case col.dataType.startsWith("FP"):
          case col.dataType.startsWith("Currency"): {
            // Numeric → right-align with tabular numbers
            td.textContent = formattedValue;
            td.classList.add("dtc-numeric");
            break;
          }

          default: {
            // Everything else (text, date, lookup) → plain formatted value
            td.textContent = formattedValue;
            break;
          }
        }
      });

      // ── Action button cell ────────────────────────────────────────────
      const actionTd = row.insertCell();
      const openBtn = document.createElement("button");
      openBtn.className = "dtc-action-btn";
      openBtn.textContent = "Open ↗";
      openBtn.title = "Open this record";
      openBtn.addEventListener("click", (e) => {
        e.stopPropagation();                // don't trigger row click
        dataset.openDatasetItem(record.getNamedReference());
      });
      actionTd.appendChild(openBtn);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    scrollWrapper.appendChild(table);
    return scrollWrapper;
  }

  // ════════════════════════════════════════════════════════════════════════
  //  RENDER: Pagination bar
  // ════════════════════════════════════════════════════════════════════════
  private _buildPagination(): HTMLElement {
    const bar = document.createElement("div");
    bar.className = "dtc-pagination";

    const total = this._allRowIds.length;
    const totalPages = Math.max(1, Math.ceil(total / this._pageSize));
    const displayStart = this._currentPage * this._pageSize + 1;
    const displayEnd = Math.min(displayStart + this._pageSize - 1, total);

    // Info text
    const info = document.createElement("span");
    info.className = "dtc-pagination-info";
    info.textContent = total === 0
      ? "No records"
      : `Showing ${displayStart}–${displayEnd} of ${total} record${total !== 1 ? "s" : ""}`;

    // Navigation
    const nav = document.createElement("div");
    nav.className = "dtc-pagination-nav";

    const prevBtn = document.createElement("button");
    prevBtn.className = "dtc-page-btn";
    prevBtn.textContent = "← Prev";
    prevBtn.disabled = this._currentPage === 0;
    prevBtn.addEventListener("click", () => {
      if (this._currentPage > 0) {
        this._currentPage--;
        this.updateView(this._context);
      }
    });

    const pageLabel = document.createElement("span");
    pageLabel.className = "dtc-page-label";
    pageLabel.textContent = `Page ${this._currentPage + 1} / ${totalPages}`;

    const nextBtn = document.createElement("button");
    nextBtn.className = "dtc-page-btn";
    nextBtn.textContent = "Next →";
    nextBtn.disabled = this._currentPage >= totalPages - 1;
    nextBtn.addEventListener("click", () => {
      if (this._currentPage < totalPages - 1) {
        this._currentPage++;
        this.updateView(this._context);
      }
    });

    nav.appendChild(prevBtn);
    nav.appendChild(pageLabel);
    nav.appendChild(nextBtn);

    bar.appendChild(info);
    bar.appendChild(nav);
    return bar;
  }
    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
