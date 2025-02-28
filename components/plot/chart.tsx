import React from 'react';
const plot = require('@stdlib/plot');

const ChartComponent = () => {
    const x = [0, 3, 6, 9, 12, 15, 18, 21, 24];
    const y = [15, 14, 13, 17, 22, 25, 23, 18, 15];

    const plt = plot([x], [y], {
        xScale: 'time',
        xTickFormat: '%H:%M',
        renderFormat: 'html',
        autoRender: false,
        xLabel: 'Time',
        yLabel: 'Temperature (°C)',
    });
    const renderHTML = plt.render('html');
    return (
        <div className="flex justify-center">
            <div
                dangerouslySetInnerHTML={{ __html: renderHTML }}
                className="bg-gray-100 hover:scale-110 transition-all hover:shadow-md"
            />
        </div>
    );
};

export default ChartComponent;
