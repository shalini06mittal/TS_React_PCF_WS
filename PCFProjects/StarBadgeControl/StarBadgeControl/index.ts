import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class StarBadgeControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
   private _inputBox: HTMLInputElement;
    private _badge: HTMLDivElement;
    private _score: number;
    private _notifyOutputChanged: () => void;
    private _initialized = false;
    private _lastInputValue: number | null = null;
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
        // Build the DOM ONCE here — never in updateView
        this._container = container;
        
        // Make container horizontal
        this._container.style.display = "flex";
        this._container.style.alignItems = "center";
        this._container.style.gap = "8px"; // spacing
        this._notifyOutputChanged = notifyOutputChanged;

        this._badge = document.createElement("div");

        this._badge.classList.add("status-badge");
        
        // Input box
        this._inputBox = document.createElement("input");
        this._inputBox.type = "number";
        // this._inputBox.style.marginRight = "10px";
        this._inputBox.style.width = "60px";   // 👈 small
        this._inputBox.style.padding = "4px";
        this._inputBox.style.fontSize = "12px";

        // Cna have internal Styles as well
        // const style = document.createElement("style");
        // style.innerHTML = `
        //     .badge--good { background-color: #28a745; }
        //     .badge--warn { background-color: #ffc107; color: black; }
        //     .badge--bad  { background-color: #dc3545; }
        // `;
        // document.head.appendChild(style);

        // 👇 CLICK HANDLER
        this._badge.addEventListener("click", () => {
            this.onClick();
        });

        // 🔥 Input change handler
        this._inputBox.addEventListener("input", () => {
            const value = Number(this._inputBox.value);
            this._score = isNaN(value) ? 0 : value;

            this.render();

            // send to app
            this._notifyOutputChanged();
        });

        this._container.appendChild(this._inputBox);
        this._container.appendChild(this._badge);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        
        console.log('update');
        
    //    if (!this._initialized) {
    //         this._score = context.parameters.score.raw ?? 0;
    //         this._initialized = true;
    //     }

        const incoming = context.parameters.score.raw ?? 0;//45
        // Only update if input actually changed externally
        if (incoming !== this._lastInputValue) {
            console.log('incoming != _lastInputValue');
            
            this._score = incoming;
            this._lastInputValue = incoming;
            // update textbox UI
            this._inputBox.value = String(this._score);
        }
        // Remove all state classes first
        this._badge.classList.remove('badge-good', 'badge-warn', 'badge-bad');

        
        // Apply exactly one state class based on value
        // Update text
        this._badge.innerText = `Score: ${this._score} (${this.getLabel()})`;
        this.render();
    }

    private getLabel(): string {
        if (this._score >= 80) return "Excellent";
        if (this._score >= 50) return "Average";
        return "Poor";
    }
     private render(): void {

        this._badge.classList.remove('badge--good', 'badge--warn', 'badge--bad');

        if (this._score >= 80) {
            this._badge.classList.add('badge-good');
        } else if (this._score >= 50) {
            this._badge.classList.add('badge-warn');
        } else {
            this._badge.classList.add('badge-bad');
        }
    }

    // 🔥 CLICK LOGIC
    private onClick(): void {
        // Example: increase score by 10 (cycle back after 100)
        console.log('on click');
        
        this._score += 10;
        console.log(this._score);
        
        if (this._score > 100) {
            this._score = 0;
        }

        this.render();

        // Notify app
        this._notifyOutputChanged();
    }
    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
   
    public getOutputs(): IOutputs {
        return {
            updatedScore: this._score
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
