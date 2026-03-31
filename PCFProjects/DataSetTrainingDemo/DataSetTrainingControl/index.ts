import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class DataSetTrainingControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void
    private _container: HTMLDivElement;
    private _currentPage = 1;
    private _pageSize = 10;
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

        this._container = container;
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;

        const PageSize = this._context.parameters.PageSize.raw || 5;
        this._context.parameters.sampleDataSet.paging.setPageSize(PageSize);

        this._container.classList.add('dataset-grid-container');

    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view

        this._container.innerHTML = "";
        const dataset = context.parameters.sampleDataSet;
        if (dataset.loading) {
            this._container.innerText = "Loading...";
            return;
        }

        // if(dataset.paging.hasNextPage){
        //     dataset.paging.loadNextPage();
        //     return;
        // }

        // table
        const table = document.createElement("table");
        table.classList.add('pcf-table');

        // header row
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        dataset.columns.forEach(column => {
            const th = document.createElement("th");
            th.innerText = column.displayName;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        /**
         * for pagination, we will only render the records for the current page. The dataset.sortedRecordIds is already sorted based on the current sort column and direction.
         */
        const start = (this._currentPage - 1) * this._pageSize;
        const end = start + this._pageSize;

        const pageRecordIds = dataset.sortedRecordIds.slice(start, end);

        pageRecordIds.forEach(recordId => {
            const record = dataset.records[recordId];

            const row = document.createElement('tr');

            dataset.columns.forEach(col => {
                const td = document.createElement('td');
                const value = record.getFormattedValue(col.name);
                td.innerText = value ? value.toString() : '';
                row.appendChild(td);
            })
            tbody.appendChild(row);
        });


        // dataset.sortedRecordIds.forEach(recordId => {
        //     const record = dataset.records[recordId];

        //     const row = document.createElement('tr');

        //     dataset.columns.forEach(col => {
        //         const td = document.createElement('td');
        //         const value = record.getFormattedValue(col.name);
        //         td.innerText = value ? value.toString() : '';
        //         row.appendChild(td);
        //     })
        //     tbody.appendChild(row);
        // });
        table.appendChild(tbody);

        this._container.appendChild(table);
        this._renderPagingControls(dataset);
    }

    private _renderPagingControls(dataset: ComponentFramework.PropertyTypes.DataSet): void {
        const paging = dataset.paging;
        const div    = document.createElement('div');
        div.classList.add('paging-controls');

        const totatRecords = dataset.sortedRecordIds.length;
        const totalPages = Math.ceil(totatRecords / this._pageSize);
    
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '< Previous';
        // prevBtn.disabled    = !paging.hasPreviousPage;
        prevBtn.onclick     = () => {
            if(this._currentPage > 1){
                this._currentPage--;
                //paging.loadPreviousPage();
                //this.updateView(this._context);
                 paging.loadPreviousPage();
                 this.updateView(this._context);
            }
           
        }
    
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next >';
        // nextBtn.disabled    = !paging.hasNextPage;
        nextBtn.onclick     = () => {
            if(this._currentPage < totalPages){
                this._currentPage++;
                paging.loadNextPage();
                this.updateView(this._context);
            }   
         //   
        }
    
        const info = document.createElement('span');
        info.textContent =
            `Page ${this._currentPage}  |  ${totalPages}`;
    
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
