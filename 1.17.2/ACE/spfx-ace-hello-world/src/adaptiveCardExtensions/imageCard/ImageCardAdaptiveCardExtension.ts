import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ImageCardPropertyPane } from './ImageCardPropertyPane';

export interface IImageCardAdaptiveCardExtensionProps {
  title: string;
}

export interface IImageCardAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'ImageCard_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'ImageCard_QUICK_VIEW';

export default class ImageCardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IImageCardAdaptiveCardExtensionProps,
  IImageCardAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ImageCardPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'ImageCard-property-pane'*/
      './ImageCardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ImageCardPropertyPane();
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
