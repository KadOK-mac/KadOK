
document.addEventListener('DOMContentLoaded', function() {
    fetch('kz_economic_indicators_new.csv')
        .then(response => response.text())
        .then(data => {
            const parsedData = Papa.parse(data, {
                header: true,
                skipEmptyLines: true
            }).data;

            // Определяем столбцы, которые содержат годы (начиная с первого числового значения)
            const years = Object.keys(parsedData[0]).filter(key => !isNaN(key));
            
            const indicators = {
                gdpPerCapita: "GDP per capita (current US$)",
                gdpGrowth: "GDP growth (annual %)",
                unemployment: "Unemployment, total (% of total labor force) (modeled ILO estimate)",
                inflation: "Consumer price index (2010 = 100)",
                govDebt: "Central government debt, total (% of GDP)",  // Обновлено название индикатора для государственного долга
                fdi: "Foreign direct investment, net inflows (% of GDP)",
                RealInfl: "Инфляция",
                Rashod: "Расходы бюджета (в млрд. тенге)",
                Dohod: "Доходы бюджета",
            };

            const datasets = {};

            Object.keys(indicators).forEach(key => {
                const indicatorData = parsedData.find(row => row['Indicator Name'] === indicators[key]);
                
                if (indicatorData) {
                    datasets[key] = years.map(year => {
                        const value = parseFloat(indicatorData[year]);
                        return isNaN(value) ? null : value;
                    });
                } else {
                    datasets[key] = Array(years.length).fill(null);
                }
            });

            const chartOptions = {
                type: 'line',
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: true, // Отключаем автоматическое пропускание меток на оси X
                                font: {
                                    size: 10 // Уменьшаем размер шрифта для меток, чтобы все годы поместились
                                }
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            };
            

            // ВВП на душу населения
            new Chart(document.getElementById('gdpPerCapitaChart'), {
                ...chartOptions,
                data: {
                    labels: years,
                    datasets: [{
                        label: 'ВВП на душу населения ($)',
                        data: datasets.gdpPerCapita,
                        borderColor: '#007BFF',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });

            // Годовой рост ВВП
            new Chart(document.getElementById('gdpGrowthChart'), {
                ...chartOptions,
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Годовой рост ВВП (%)',
                        data: datasets.gdpGrowth,
                        borderColor: '#28a745',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });

            // Уровень безработицы
            new Chart(document.getElementById('unemploymentChart'), {
                ...chartOptions,
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Безработица (% от рабочей силы)',
                        data: datasets.unemployment,
                        borderColor: '#dc3545',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });

            // Индекс потребительских цен (CPI)
            new Chart(document.getElementById('inflationChart'), {
                ...chartOptions,
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Индекс потребительских цен (CPI)',
                        data: datasets.inflation,
                        borderColor: '#ffc107',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });


            // Государственный долг
            new Chart(document.getElementById('govDebtChart'), {
                ...chartOptions,
                options: {
                    ...chartOptions.options,
                    scales: {
                        x: {
                            type: 'category',
                            min: '2002', // Устанавливаем минимальное значение оси X на 2002 год для этого графика
                            title: {
                                display: true
                            }
                        }
                    }
                },
                data: {
                    labels: years, // Ваш массив с годами
                    datasets: [{
                        label: 'Государственный долг (млрд. тенге)',
                        data: datasets.govDebt,
                        borderColor: '#17a2b8',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });

/*
            // Государственный долг если добавить данные с 1991 года
            new Chart(document.getElementById('govDebtChart'), {
                ...chartOptions,
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Государственный долг',
                        data: datasets.govDebt,
                        borderColor: '#17a2b8',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });
*/

            // Прямые иностранные инвестиции
            new Chart(document.getElementById('fdiChart'), {
                ...chartOptions,
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Прямые иностранные инвестиции (% от ВВП)',
                        data: datasets.fdi,
                        borderColor: '#6610f2',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });


            /*
            // Инфляция с 1991 года (но график не понятный)
            new Chart(document.getElementById('inflationChart_real'), {
                ...chartOptions,
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Инфляция (%)',
                        data: datasets.RealInfl,
                        borderColor: '#6610f2',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });
            */
            
            // Инфляция с 2000 года
            new Chart(document.getElementById('inflationChart_real'), {
                ...chartOptions,
                options: {
                    ...chartOptions.options,
                    scales: {
                        x: {
                            type: 'category',
                            min: '2000', // Устанавливаем минимальное значение оси X на 2000 год для этого графика
                            title: {
                                display: true
                            }
                        }
                    }
                },
                data: {
                    labels: years, // Ваш массив с годами
                    datasets: [{
                        label: 'Инфляция (%)',
                        data: datasets.RealInfl,
                        borderColor: 'red',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });

            // Расходы бюджета с 1993 года
            new Chart(document.getElementById('budgetExpensesChart'), {
                ...chartOptions,
                options: {
                    ...chartOptions.options,
                    scales: {
                        x: {
                            type: 'category',
                            min: '1993', // Устанавливаем минимальное значение оси X на 1993 год для этого графика
                            title: {
                                display: true
                            }
                        }
                    }
                },
                data: {
                    labels: years, // Ваш массив с годами
                    datasets: [{
                        label: 'Расходы бюджета (млрд. тенге)',
                        data: datasets.Rashod,
                        borderColor: 'orange',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });

            // Доходы бюджета с 1993 года
            new Chart(document.getElementById('budgetRevenueChart'), {
                ...chartOptions,
                options: {
                    ...chartOptions.options,
                    scales: {
                        x: {
                            type: 'category',
                            min: '1993', // Устанавливаем минимальное значение оси X на 1993 год для этого графика
                            title: {
                                display: true
                            }
                        }
                    }
                },
                data: {
                    labels: years, // Ваш массив с годами
                    datasets: [{
                        label: 'Доходы бюджета (млрд. тенге)',
                        data: datasets.Dohod,
                        borderColor: 'green',
                        borderWidth: 1, // Устанавливаем толщину линии
                        fill: false
                    }]
                }
            });



        });
});

// Функция увеличения диаграммы при клике
const modal = document.getElementById("chartModal");
const modalChartElement = document.getElementById("modalChart");
const closeModal = document.querySelector(".close");
let modalChartInstance;  // Храним экземпляр графика в модальном окне

// Добавляем обработчик события клика на график
document.querySelectorAll("#indicators canvas").forEach(canvas => {
    canvas.addEventListener("click", function() {
        // Если уже есть график в модальном окне, удаляем его
        if (modalChartInstance) {
            modalChartInstance.destroy();
        }
        
        // Клонируем данные графика
        const chart = Chart.getChart(this);
        const config = chart.config;

        // Здесь добавляем изменение толщины линии
        config.data.datasets.forEach(dataset => {
            dataset.borderWidth = 3;  // Устанавливаем новую толщину линии, например 5
        });
        
        config.options.scales.x.ticks.color = '#FFFFFF';  // Белый цвет подписей на оси X
        config.options.scales.y.ticks.color = '#FFFFFF';  // Белый цвет подписей на оси Y
        
        // Изменяем цвет метки (label) в легенде
        if (!config.options.plugins.legend) {
            config.options.plugins.legend = {
                display: true,
                labels: {}
            };
        }
        if (!config.options.plugins.legend.labels) {
            config.options.plugins.legend.labels = {};
        }
        config.options.plugins.legend.labels.color = '#FFFFFF';  // Устанавливаем белый цвет меток графика



        // Показываем модальное окно
        modal.style.display = "block";
        
        // Создаем новый график в модальном окне с измененной конфигурацией
        modalChartInstance = new Chart(modalChartElement, config);
    });
});

// Закрываем модальное окно при клике на "x"
closeModal.addEventListener("click", function() {
    modal.style.display = "none";
    if (modalChartInstance) {
        modalChartInstance.destroy();  // Удаляем график при закрытии окна
        modalChartInstance = null;  // Обнуляем переменную
    }
});

// Закрываем модальное окно при клике вне его области
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        if (modalChartInstance) {
            modalChartInstance.destroy();  // Удаляем график при закрытии окна
            modalChartInstance = null;  // Обнуляем переменную
        }
    }
});

// Функция имитации анализа макроэкономики Казахстана
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('analysisModal');
    var btn = document.getElementById('analyzeButton');
    var span = document.getElementsByClassName('close-analysis')[0];
    var progressContainer = document.getElementById('progressContainerAnalysis');
    var progressBar = document.getElementById('progressBarAnalysis');
    var analysisResult = document.getElementById('analysisResultAnalysis');

    btn.onclick = function() {
        modal.style.display = "block";
        progressBar.style.width = "0";
        progressContainer.style.display = "block"; // Показываем контейнер прогресс-бара
        analysisResult.style.display = "none";
        setTimeout(function() {
            var width = 0;
            var interval = setInterval(function() {
                if (width >= 100) {
                    clearInterval(interval);
                    progressContainer.style.display = "none"; // Полностью скрываем контейнер прогресс-бара
                    analysisResult.style.display = "block"; // Показать результаты анализа
                } else {
                    width += 20;
                    progressBar.style.width = width + '%';
                }
            }, 300); // Имитация выполнения анализа в течение 5 секунд
        }, 100);
    };

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});
