import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class StarRatingControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
      private _container: HTMLDivElement;
    private _stars: HTMLSpanElement[] = [];
    private _label: HTMLSpanElement;
    private _value= 0;
    private _hoverValue = 0;
    private _notifyOutputChanged: () => void;

  

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._notifyOutputChanged = notifyOutputChanged;

    this._container = document.createElement('div');
    this._container.style.cssText = [
      'display:flex', 'align-items:center', 'gap:6px',
      'padding:4px 0', 'font-family:Segoe UI,sans-serif',
    ].join(';');

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = '★';
      star.dataset.index = String(i);
      star.style.cssText = [
        'font-size:36px', 'cursor:pointer', 'color:#cccccc',
        'transition:color 0.15s ease,transform 0.1s ease',
        'user-select:none', 'line-height:1',
      ].join(';');

      star.addEventListener('click', () => {
        if (context.mode.isControlDisabled) return;
        this._value = parseInt(star.dataset.index!, 10);
        this._notifyOutputChanged();
        this._updateStarColors();
      });
      star.addEventListener('mouseenter', () => {
        if (context.mode.isControlDisabled) return;
        this._hoverValue = parseInt(star.dataset.index!, 10);
        this._updateStarColors();
      });
      star.addEventListener('mouseleave', () => {
        this._hoverValue = 0;
        this._updateStarColors();
      });

      this._stars.push(star);
      this._container.appendChild(star);
    }

    this._label = document.createElement('span');
    this._label.style.cssText = [
      'font-size:13px', 'font-weight:600',
      'color:#333333', 'margin-left:4px',
    ].join(';');
    this._container.appendChild(this._label);
    container.appendChild(this._container);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._value = context.parameters.rating.raw ?? 0;
    const rawLabel = context.parameters.label.raw ?? '';
    this._label.textContent = rawLabel.trim() || 'Rate';

    const isDisabled = context.mode.isControlDisabled;
    this._container.style.opacity = isDisabled ? '0.55' : '1';
    this._container.style.pointerEvents = isDisabled ? 'none' : 'auto';

    this._updateStarColors();
  }

  private _updateStarColors(): void {
    const activeValue = this._hoverValue || this._value;
    this._stars.forEach((star, index) => {
      const n = index + 1;
      star.style.color     = n <= activeValue ? '#FFB900' : '#CCCCCC';
      star.style.transform = n <= activeValue ? 'scale(1.15)' : 'scale(1)';
    });
  }

  public getOutputs(): IOutputs {
    const safeValue = Math.max(0, Math.min(5, Math.round(this._value)));
    return { rating: safeValue };
  }

  public destroy(): void {
    // Local element listeners are cleaned up by the GC with the DOM.
    // Add removeEventListener calls here for any global listeners.
  }
}
