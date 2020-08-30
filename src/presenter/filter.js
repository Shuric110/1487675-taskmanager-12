import FilterView from "../view/filter.js";

import {RenderPosition, replaceOrRender, remove} from "../util/render.js";

export default class Filter {
  constructor(filterContainer, tasksModel, boardModel) {
    this._filterContainer = filterContainer;
    this._tasksModel = tasksModel;
    this._boardModel = boardModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._onModelEvent = this._onModelEvent.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._tasksModel.addObserver(this._onModelEvent);
    this._boardModel.addObserver(this._onModelEvent);
  }

  init() {
    this._currentFilter = this._boardModel.getFilter();
    const tasks = this._tasksModel.getTasks();

    const filters = this._boardModel.getFilterDefinitions().map(({code, title, filter}) =>
      ({
        code,
        title,
        tasksCount: tasks.filter(filter).length
      }));

    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);

    replaceOrRender(this._filterContainer, this._filterComponent, oldFilterComponent, RenderPosition.BEFOREEND);
    remove(oldFilterComponent);
  }

  _onModelEvent() {
    this.init();
  }

  _onFilterTypeChange(filterType) {
    if (filterType !== this._currentFilter.code) {
      this._boardModel.setFilter(filterType);
    }
  }

}
