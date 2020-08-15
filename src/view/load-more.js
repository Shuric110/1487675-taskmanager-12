import ComponentView from "./component.js";

export default class LoadMore extends ComponentView {
  constructor() {
    super();
    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }

  getTemplate() {
    return `
      <button class="load-more" type="button">load more</button>
    `;
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick();
  }

  setButtonClickHandler(callback) {
    this.getElement().addEventListener(`click`, this._buttonClickHandler);
    this._callback.buttonClick = callback;
  }
}
