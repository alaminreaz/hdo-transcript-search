var React                  = require('react');
var c3                     = require('c3');
// var SearchAppDispatcher = require('../dispatcher/SearchAppDispatcher');
var TranscriptStore        = require('../stores/TranscriptStore');
var ActionTypes            = require('../constants/ActionTypes');
var div                    = React.DOM.div;

var Timeline = React.createClass({
    componentDidMount: function () {
        var node = this.getDOMNode();
        this.renderChartTo(node);
        TranscriptStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        this.chart.unload();
        TranscriptStore.removeChangeListener(this.onChange);
    },

    render: function () {
        return div({className: 'row'});
    },

    // helpers

    addData: function(query, data) {
        var dates = [];
        var vals = [];

        data.forEach(function (e) {
            dates.push(new Date(e.date));
            vals.push(e.pct);
        });

        var cols = [
            ['x'].concat(dates),
            [query].concat(vals)
        ];

        this.chart.load({ columns: cols });
    },

    onChange: function () {
        var query = TranscriptStore.getQuery();
        var result = TranscriptStore.getResult();

        if (query && result) {
            this.addData(query, result.counts);
        } else {
            this.chart.unload();
        }
    },

    renderChartTo: function (node) {
        this.chart = c3.generate({
            bindto: node,
            data: {
                x: 'x',
                columns: [
                    ['x']
                ],
                type: 'spline'
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: "%Y-%m-%d"
                    }
                },
                y: {
                    tick: {
                        format: function (d) { return d + '%'; }
                    },
                    // max: 100,
                    min: 0,
                    padding: { top: 0, bottom: 0 }
                }
            },
            point: { show: false },
            subchart: { show: false }

            //        color: { pattern: ["#111", "#fadd00", "#b8bfcc", "#ccc", "#455068"] }
        });
    }
});

module.exports = Timeline;