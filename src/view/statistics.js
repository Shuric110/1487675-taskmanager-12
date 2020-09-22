import SmartComponentView from "./smart-component.js";

import {colorValues} from "../const.js";

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import flatpickr from "flatpickr";
import moment from "moment";

const DEFAULT_STATISTICS_DAYS = 7;

const renderColorsChart = (colorsCtx, tasksByColor) => {
  return new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: Object.keys(tasksByColor),
      datasets: [{
        data: Object.values(tasksByColor).map(({count}) => count),
        backgroundColor: Object.values(tasksByColor).map(({hex}) => hex)
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const renderDaysChart = (daysCtx, tasksByDay) => {
  return new Chart(daysCtx, {
    plugins: [ChartDataLabels],
    type: `line`,
    data: {
      labels: Object.keys(tasksByDay),
      datasets: [{
        data: Object.values(tasksByDay),
        backgroundColor: `transparent`,
        borderColor: `#000000`,
        borderWidth: 1,
        lineTension: 0,
        pointRadius: 8,
        pointHoverRadius: 8,
        pointBackgroundColor: `#000000`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 8
          },
          color: `#ffffff`
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            fontStyle: `bold`,
            fontColor: `#000000`
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 10
        }
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const calculateStatistics = function (tasks, dateFrom, dateTo) {
  dateFrom = moment(dateFrom);
  dateTo = moment(dateTo).add(1, `days`);

  let tasksTotal = 0;

  // Все дни заданного диапазона
  const tasksByDay = {};
  const currentDate = moment(dateFrom);
  while (currentDate.isBefore(dateTo)) {
    tasksByDay[currentDate.format(`D MMM`)] = 0;
    currentDate.add(1, `days`);
  }

  // Все доступные цвета
  const tasksByColor = Object.entries(colorValues).reduce(
      (result, [color, colorValue]) => Object.assign(result, {[color]: {hex: colorValue, count: 0}}),
      {});

  // Расчёт статистики
  tasks.forEach(({dueDate, color}) => {
    if (!dueDate || dateFrom.isAfter(dueDate) || dateTo.isSameOrBefore(dueDate)) {
      return;
    }

    tasksByDay[moment(dueDate).format(`D MMM`)]++;
    tasksByColor[color].count++;
    tasksTotal++;
  });

  // Удаление ненайденных цветов
  Object.entries(tasksByColor).forEach(([color, {count}]) => {
    if (count === 0) {
      delete tasksByColor[color];
    }
  });

  return {
    tasksTotal,
    tasksByDay,
    tasksByColor
  };

};

export default class Statistics extends SmartComponentView {
  constructor(tasks) {
    super();

    this._datePicker = null;

    const dateTo = moment().startOf(`day`).toDate();
    const dateFrom = moment(dateTo).subtract(DEFAULT_STATISTICS_DAYS - 1, `days`).toDate();
    this._data = {
      tasks,
      dateFrom,
      dateTo,
      statistics: calculateStatistics(tasks, dateFrom, dateTo)
    };

    this._datesChangeHandler = this._datesChangeHandler.bind(this);
  }

  _datesChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo,
      statistics: calculateStatistics(this._data.tasks, dateFrom, dateTo)
    });

    this.renderCharts();
  }

  _setDatesPicker() {
    if (this._datePicker) {
      this._datePicker.destroy();
    }

    this._datePicker = flatpickr(
        this.getElement().querySelector(`.statistic__period-input`),
        {
          mode: `range`,
          dateFormat: `j F`,
          defaultDate: [this._data.dateFrom, this._data.dateTo],
          onChange: this._datesChangeHandler
        }
    );
  }

  renderCharts() {
    // Метод должен быть вызван для уже видимого компонента (особенность chart.js)
    const colorsCtx = this.getElement().querySelector(`.statistic__colors`);
    const daysCtx = this.getElement().querySelector(`.statistic__days`);

    this._colorsChart = renderColorsChart(colorsCtx, this._data.statistics.tasksByColor);
    this._daysChart = renderDaysChart(daysCtx, this._data.statistics.tasksByDay);
  }

  _setInnerHandlers() {
    this._setDatesPicker();
  }

  removeElement() {
    super.removeElement();

    this._colorsChart = null;
    this._daysChart = null;

    if (this._datePicker) {
      this._datePicker.destroy();
      this._datePicker = null;
    }
  }

  getTemplate() {
    return `
      <section class="statistic container">
        <div class="statistic__line">
          <div class="statistic__period">
            <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

            <div class="statistic-input-wrap">
              <input
                class="statistic__period-input"
                type="text"
                placeholder="01 Feb - 08 Feb"
              />
            </div>

            <p class="statistic__period-result">
              In total for the specified period
              <span class="statistic__task-found">${this._data.totalTasks}</span> tasks were fulfilled.
            </p>
          </div>
          <div class="statistic__line-graphic">
            <canvas class="statistic__days" width="550" height="150"></canvas>
          </div>
        </div>

        <div class="statistic__circle">
          <div class="statistic__colors-wrap">
            <canvas class="statistic__colors" width="400" height="300"></canvas>
          </div>
        </div>
      </section>
    `;
  }
}
