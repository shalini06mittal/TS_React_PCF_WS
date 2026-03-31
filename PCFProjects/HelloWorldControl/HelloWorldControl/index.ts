import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class HelloWorldControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container : HTMLDivElement
    private _greeting : HTMLDivElement;
    private _context : ComponentFramework.Context<IInputs>;
    private _outputText:string;
    private _notifyOutputChanged:() => void;
   // private _text:string;

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
        console.log('init called');

        this._container = container;
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        /**
         * property type : input =>pass data from power apps to component [ read-only in my component]
         * property type : output =>pass data from component  to power apps(dataverse)
         */
        
        this._outputText = context.parameters.inputText?.raw?? "Default";

        this._greeting = document.createElement('div');
        
        // Create a styled greeting element              // ← highlighted
        this._greeting.style.padding = '16px';          // ← highlighted
        this._greeting.style.background = 'linear-gradient(135deg, #667eea, #764ba2)'; // ← highlighted
         this._greeting.style.borderRadius = '8px';      // ← highlighted
        this._greeting.style.color = this._context.parameters.samplePropertyTextColor.raw ?? 'white';           // ← highlighted
       
        this._greeting.style.fontSize = this._context.parameters.samplePropertyTextSize.raw ??'20px';         // ← highlighted
        this._greeting.style.fontWeight = this._context.parameters.samplePropertyTextWeight.raw ??'bold';       // ← highlighted
        this._greeting.style.textAlign = 'center';      // ← highlighted
        this._greeting.innerText = `Hello, Guest! 👋`;  // ← highlighted

        this._greeting.addEventListener('click', () => {
            alert('Greeting clicked!');
            this._notifyOutputChanged();
        });

        const style = document.createElement('style');

        // style.innerHTML = `
            // .glow{
            //      -webkit-animation: glow 1s ease-in-out infinite alternate;
            //     -moz-animation: glow 1s ease-in-out infinite alternate;
            //     animation: glow 1s ease-in-out infinite alternate;
            // }

            // @keyframes glow {
            // from {
            // text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
            // }
            // to {
            // text-shadow: 0 0 20px #fff, 0 0 30px #4d68ff, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
            // }

        // `
        // document.head.appendChild(style);
        this._greeting.className = "glow";
        this._container.appendChild(this._greeting);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        console.log('update called');
        // console.log(this._context.parameters.samplePropertyText.raw);
        // console.log(this._context.parameters.samplePropertyText.formatted);
        // console.log(this._context.parameters.samplePropertyText.type);
        // console.log(this._context.parameters.samplePropertyText.errorMessage);

        this._greeting.innerText = this._context.parameters.samplePropertyText.raw || 'Hello, Guest! 👋';
         this._greeting.style.color = this._context.parameters.samplePropertyTextColor.raw ?? 'white';           // ← highlighted
       
        this._greeting.style.fontSize = this._context.parameters.samplePropertyTextSize.raw ??'20px';         // ← highlighted
        this._greeting.style.fontWeight = this._context.parameters.samplePropertyTextWeight.raw ??'bold'; 
        
        const newValue = (this._context.parameters.inputText.raw || "Time: ") + " at " + new Date().toLocaleTimeString();
        this._outputText = newValue;
        console.log('output text ' + this._outputText);
       // this._notifyOutputChanged();
    }


    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        console.log('get outputs called');
        return {
            outputText: this._outputText,
            samplePropertyText: 'Update bound property from component',
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        console.log('destroy called');
        // Add code to cleanup control if necessary
        this._container.innerHTML = '';
    }
}
