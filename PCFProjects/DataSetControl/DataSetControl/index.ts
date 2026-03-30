import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class DataSetControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container:    HTMLDivElement;
    private _context:      ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void

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
        this._context           = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container         = container;
    
        // Set the page size from the manifest property (default 10)
        const pageSize = context.parameters.PageSize.raw ?? 10;
        context.parameters.sampleDataSet.paging.setPageSize(pageSize);
    
        this._container.classList.add('dataset-grid-container');

    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
            this._context = context;
    const dataset = context.parameters.sampleDataSet;
 
    // Clear previous render
    this._container.innerHTML = '';
 
    if (dataset.loading) {
        this._container.innerHTML = '<p class="loading">Loading records...</p>';
        return;
    }
 
    // ── Build the table ──────────────────────────────────────────
    const table   = document.createElement('table');
    table.classList.add('pcf-table');
 
    // Header row
    const thead = document.createElement('thead');
    const hRow  = document.createElement('tr');
 
    dataset.columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.displayName;
        hRow.appendChild(th);
    });
    thead.appendChild(hRow);
    table.appendChild(thead);
 
    // Data rows
    const tbody = document.createElement('tbody');
 
    dataset.sortedRecordIds.forEach(recordId => {
        const record = dataset.records[recordId];
        const row    = document.createElement('tr');
 
        dataset.columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = record.getFormattedValue(col.name);
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    this._container.appendChild(table);
 
    // ── Paging controls ─────────────────────────────────────────
    this._renderPagingControls(dataset);

    }
private _renderPagingControls(
    dataset: ComponentFramework.PropertyTypes.DataSet
): void {
    const paging = dataset.paging;
    const div    = document.createElement('div');
    div.classList.add('paging-controls');
 
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '< Previous';
    prevBtn.disabled    = !paging.hasPreviousPage;
    prevBtn.onclick     = () => paging.loadPreviousPage();
 
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next >';
    nextBtn.disabled    = !paging.hasNextPage;
    nextBtn.onclick     = () => paging.loadNextPage();
 
    const info = document.createElement('span');
    info.textContent =
        `Page ${paging.totalResultCount}  |  ${dataset.sortedRecordIds.length} records`;
 
    div.appendChild(prevBtn);
    div.appendChild(info);
    div.appendChild(nextBtn);
    this._container.appendChild(div);
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
