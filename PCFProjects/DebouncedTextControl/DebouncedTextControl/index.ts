import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class DebouncedTextControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
  private _input: HTMLInputElement;

  private _notifyOutputChanged: () => void;

  private _currentValue = "";

  // 🔥 Debounce timer
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

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
       this._container = container;
    this._notifyOutputChanged = notifyOutputChanged;

    // Create input element
    this._input = document.createElement("input");
    this._input.type = "text";
    this._input.style.width = "100%";
    this._input.style.padding = "8px";
    this._input.style.fontSize = "14px";

    // Set initial value
    this._currentValue = context.parameters.sampleProperty.raw || "";
    this._input.value = this._currentValue;

    // Attach debounced handler
    this._input.addEventListener("input", this._onTextChange.bind(this));

    this._container.appendChild(this._input);
  }

  // -----------------------------------
  // UPDATE VIEW
  // -----------------------------------
  public updateView(context: ComponentFramework.Context<IInputs>): void {

    const newValue = context.parameters.sampleProperty.raw || "";
    console.log(`New Value : ${newValue} , Current Value : ${this._currentValue}`);
    
    // Avoid overwriting while typing
    if (newValue !== this._currentValue) {
      this._currentValue = newValue;
      this._input.value = newValue;
    }
  }

  // -----------------------------------
  // GET OUTPUTS
  // -----------------------------------
  public getOutputs(): IOutputs {
    return {
      sampleProperty: this._currentValue
    };
  }

  // -----------------------------------
  // 🔥 DEBOUNCED INPUT HANDLER
  // -----------------------------------
  private _onTextChange(e: Event): void {

    this._currentValue = (e.target as HTMLInputElement).value;
    console.log(`on text change ${this._currentValue}`);
    

    // Cancel previous timer
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    // Trigger output after 400ms idle
    this._debounceTimer = setTimeout(() => {
      this._notifyOutputChanged();
    }, 400);
  }

  // -----------------------------------
  // DESTROY
  // -----------------------------------
  public destroy(): void {

    // Cleanup timer
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    // Remove event listener (best practice)
    this._input.removeEventListener("input", this._onTextChange);
  }
}
