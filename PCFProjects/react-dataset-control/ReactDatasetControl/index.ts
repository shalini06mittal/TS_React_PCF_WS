import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import * as React from "react";
import { ReactDataSetControl } from "./ReactDataSetControl";
//type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class ReactDatasetControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _currentPage = 1;
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
       // container: HTMLDivElement
    ): void {
        // Add control initialization code
      //  this._container = container;
        this._context = context;

        // tell PCF that we need ful dataset paging infor
        context.mode.trackContainerResize(true);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

        console.log('update');
        
        // Add code to update control view
        this._context = context;

       // return React.createElement("div", { style: { padding: "16px", fontFamily: "Segoe UI, sans-serif" } }, "Loading...");

        if(context.parameters.sampleDataSet.loading){
            return React.createElement("div", { style: { padding: "16px", fontFamily: "Segoe UI, sans-serif" } }, "Loading...");
        }

        const dataSet = context.parameters.sampleDataSet;

        // extract column names
        const columns = dataSet.columns.filter(column => !column.isHidden).map(column => column.displayName);

        // extract rows
        const rows = dataSet.sortedRecordIds.map(id => {
            const row = dataSet.records[id];
            const record: Record<string, string> = {};
            dataSet.columns
            .filter(column => !column.isHidden)
            .forEach(column => {
                record[column.displayName] = row.getFormattedValue(column.name) ?? "";
            });

            return record;
        });

        
        return React.createElement(ReactDataSetControl, {
            columns,
            rows,
            totalCount: dataSet.paging.totalResultCount,
            currentPage: this._currentPage,
            pageSize: dataSet.paging.pageSize,
            onNextPageChange: () => {
                dataSet.paging.loadNextPage();
                this._currentPage++;
            },
            onPreviousPageChange: () => {
                dataSet.paging.loadPreviousPage();
                this._currentPage--;
            }
        });
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
