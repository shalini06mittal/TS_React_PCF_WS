import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class ConditionalRenderingControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _viewMode: HTMLDivElement   // shown when field is read-only
    private _editMode: HTMLDivElement   // shown when field is editable
    private _emptyState: HTMLDivElement // shown when value is null
  
    private _input: HTMLInputElement;
    private _value: string;
    private _notifyOutputChanged: () => void;

    
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
        // Create ALL panels in init()

        this._notifyOutputChanged = notifyOutputChanged;
           // 🔹 VIEW MODE
        this._viewMode = document.createElement('div');
        this._viewMode.className = 'panel panel--view';
        this._viewMode.textContent ="view"

        // 🔹 EDIT MODE
        this._editMode = document.createElement('div');
        this._editMode.className = 'panel panel--edit';
        this._editMode.textContent ="edit"

        this._input = document.createElement('input');
        this._input.type = "text";
        this._input.className = "input";

        // Handle input change
        this._input.addEventListener("input", () => {
            this._value = this._input.value;
            this._notifyOutputChanged();
        });

        this._editMode.appendChild(this._input);

        // 🔹 EMPTY STATE
        this._emptyState = document.createElement('div');
        this._emptyState.className = 'panel panel--empty';
        this._emptyState.textContent = 'No value set';

        // 🔹 Inject styles
        const style = document.createElement("style");
        style.innerHTML = `
            .panel {
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                font-family: Segoe UI, sans-serif;
            }

            .panel--view {
                background-color: #2c6bd7;
                color: #323130;
            }

            .panel--edit {
                background-color: #d41a1a;
                border: 1px solid #d1d1d1;
            }

            .panel--empty {
                background-color: #12bb47;
                font-style: italic;
            }

            .input {
                width: 100%;
                padding: 6px;
                font-size: 14px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);

        
            // Append ALL to container — visibility controlled via CSS
            container.appendChild(this._viewMode)
            container.appendChild(this._editMode)
            container.appendChild(this._emptyState)

    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
            const value       = context.parameters.value.raw
            const isDisabled  =  context.mode.isControlDisabled || context.parameters.debugDisabled.raw;
       
        
            console.log('value ', value, 'is disabled', isDisabled);
            
            // Guard clause: nothing to render
            if (value === null || value === undefined || value.trim() === '') {
                console.log('value in if');
                this._emptyState.style.display = 'block'
                this._viewMode.style.display   = 'none'
                this._editMode.style.display   = 'none'
                return
            }
        
            this._emptyState.style.display = 'none'
        
            // // Toggle between view and edit panels
            if (isDisabled) {
            this._viewMode.style.display = 'block'
            this._editMode.style.display = 'none'
            this._viewMode.textContent   = String(value)
            } 
            else {
            this._viewMode.style.display = 'none'
            this._editMode.style.display = 'block'
            }

    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            updatedValue: this._value
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
