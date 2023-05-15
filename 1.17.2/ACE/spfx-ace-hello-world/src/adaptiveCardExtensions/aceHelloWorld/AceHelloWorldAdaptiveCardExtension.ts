import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceHelloWorldPropertyPane } from './AceHelloWorldPropertyPane';

export interface IAceHelloWorldAdaptiveCardExtensionProps {
  title: string;
}

export interface IAceHelloWorldAdaptiveCardExtensionState {
  time: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'AceHelloWorld_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceHelloWorld_QUICK_VIEW';

export default class AceHelloWorldAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceHelloWorldAdaptiveCardExtensionProps,
  IAceHelloWorldAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceHelloWorldPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { 
      time: this.getTime()
    };
    setInterval(() => {
      this.setState({ 
        time: this.getTime()
      })  
    }, 1000);
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  private getTime(){
    const now = new Date();
    const hours = ("0" + now.getHours()).slice(-2);
    const minutes = ("0" + now.getMinutes()).slice(-2);
    const seconds = ("0" + now.getSeconds()).slice(-2);
    const time = hours + ":" + minutes + ":" + seconds;
    console.log(time);
    return time;
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AceHelloWorld-property-pane'*/
      './AceHelloWorldPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AceHelloWorldPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
