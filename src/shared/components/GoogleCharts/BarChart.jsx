import React, {useState, useEffect} from "react";
import { Chart } from "react-google-charts";

const BarChart = ({
    data,
    title,
    options={},
    className="w-full max-h-[500px]",
  }) => {
    const [chartOptions, setChartOptions] = useState({
        labelKey: "name", 
        matrixKey: "martix",
        valueKey: "value", 
        legend: {position: "none", maxLines: 2}, 
        height: "400px",
        header: ["Keyword", "Matrix", "Value"], 
        // bar: {groupWidth: "75%"},
        // vAxis:{
        //     title: "Keyword"
        // },
        hAxis:{
            minValue: 0,
            title: "Popularity Increase"
        },
        chartPackages: ["bar"],
        bars: "horizontal",
        isStacked: 'absolute',
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
        const prepared_data = [chartOptions.header, ...data.map((item) => {
            const mappedVal = [];
            if(chartOptions?.labelKey && chartOptions?.labelKey != null){
                mappedVal[0] = item[chartOptions?.labelKey];
            }
            if(chartOptions?.matrixKey && chartOptions?.matrixKey != null){
                mappedVal[1] = item[chartOptions?.matrixKey];
            }
            if(chartOptions?.valueKey && chartOptions?.valueKey != null){
                mappedVal[1] = item[chartOptions?.valueKey]
            }
            return mappedVal;
        })];
        return prepared_data;
    }
    return (
        <div className={"bg-white p-4 rounded-lg shadow "+ className}>
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            )}
            <Chart
                chartType="Bar"
                options={chartOptions}
                data={ prepareData() }
                width={"100%"}
            />
        </div>
    );
  }

  export default BarChart