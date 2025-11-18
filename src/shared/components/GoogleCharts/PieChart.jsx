import React, {useState, useEffect} from "react";
import { Chart } from "react-google-charts";

const PieChart = ({
    data,
    title,
    options={},
    className="w-full max-h-[500px]",
  }) => {
    const [chartOptions, setChartOptions] = useState({
        labelKey: "name", 
        valueKey: "value", 
        legend: {position: "bottom", maxLines: 2}, 
        height: "400px",
        header: ["Data", "Value"], 
        chartArea: { top: 15, left:45, right:45, bottom: 45 },
        animation: { startup: true, duration: 1000, easing: "in" },
    });

    useEffect(() => {
        setChartOptions((prev) => ({
            ...prev,
            ...options
        }));
    }, [options]);

    const prepareData = () => {
        const prepared_data = [chartOptions.header, ...data.map((item) => [
            chartOptions?.labelKey ? item[chartOptions?.labelKey] : item, 
            chartOptions?.valueKey ? item[chartOptions?.valueKey] : item
        ])];
        return prepared_data;
    }
    return (
        <div className={"bg-white p-4 rounded-lg shadow "+ className}>
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            )}
            <Chart
                chartType="PieChart"
                options={chartOptions}
                data={ prepareData() }
                width={"100%"}
            />
        </div>
    );
  }

  export default PieChart