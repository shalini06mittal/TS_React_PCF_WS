import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class DatasetApiControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

   
    //Instance variables
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    
    private _dataLoaded= false;
    private _data: any[] = [];

    private fetchData(): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, name: "Shalini", role: "Trainer" },
                    { id: 2, name: "Rahul", role: "Developer" },
                    { id: 3, name: "Amit", role: "Tester" }
                ]);
            }, 4000); // simulate API delay
        });
    }
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

        // Initial UI
        this._container.innerHTML = "Initializing control...";
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
         this._context = context;

        // Prevent multiple API calls
        if (!this._dataLoaded) {
            this._dataLoaded = true;

            //this._container.innerHTML = "Loading data from API...";
            // this._renderLoading();
            this.showSpinner();
            this.fetchData().then((result) => {
                this._data = result;
                this.renderData();
            });

            return;
        }

        // Re-render if needed
        this.renderData();
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

  private showSpinner(): void {
    this._container.innerHTML = "";

    const spinner = document.createElement("div");

    spinner.style.width = "40px";
    spinner.style.height = "40px";
    spinner.style.border = "5px solid #f3f3f3";
    spinner.style.borderTop = "5px solid #667eea";
    spinner.style.borderRadius = "50%";
    spinner.style.animation = "spin 1s linear infinite";
    spinner.style.margin = "40px auto";

    // Add animation style
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    this._container.appendChild(style);
    this._container.appendChild(spinner);
}
    //Render function
    private renderData(): void {

        this._container.innerHTML = "";

        // Header
        const header = document.createElement("h3");
        header.innerText = "👥 Employee List (API Data)";
        this._container.appendChild(header);

        // Data rows
        this._data.forEach(item => {

            const row = document.createElement("div");

            // Styling
            row.style.padding = "10px";
            row.style.margin = "6px 0";
            row.style.border = "1px solid #ddd";
            row.style.borderRadius = "8px";
            row.style.background = "#f9f9f9";
            row.style.display = "flex";
            row.style.justifyContent = "space-between";

            // Name + Role
            const text = document.createElement("span");
            text.innerText = `${item.name} - ${item.role}`;

            // Optional badge
            const badge = document.createElement("span");
            badge.innerText = item.role;
            badge.style.background = "#667eea";
            badge.style.color = "white";
            badge.style.padding = "2px 8px";
            badge.style.borderRadius = "12px";
            badge.style.fontSize = "12px";

            row.appendChild(text);
            row.appendChild(badge);

            this._container.appendChild(row);
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
