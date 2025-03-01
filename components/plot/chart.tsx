const plot = require('@stdlib/plot');

const ChartComponent = ({
    x,
    y,
    xlabel,
    ylabel,
    ymin,
}: {
    x: any;
    y: any;
    xlabel: string;
    ylabel: string;
    ymin?: number;
}) => {
    const plt = plot([x], [y], {
        xScale: 'time',
        xTickFormat: '%H:%M %y-%m-%d',
        yScale: 'linear',
        width: 600,
        renderFormat: 'html',
        autoRender: false,
        yMin: ymin ? ymin : null,
        xLabel: xlabel,
        yLabel: ylabel,
    });
    const renderHTML = plt.render('html');
    return (
        <div className="flex justify-center">
            <div
                dangerouslySetInnerHTML={{ __html: renderHTML }}
                className="bg-gray-100 hover:scale-110 transition-all hover:shadow-lg rounded-lg"
            />
        </div>
    );
};

export default ChartComponent;
