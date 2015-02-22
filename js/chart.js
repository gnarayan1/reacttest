/**
 * Created by geeth on 8/14/14.
 */
/*** @jsx React.DOM */

var nullData = {};

var tableReact =
    React.createClass({
        getInitialState: function() {
            console.log('tableReact getInitialState');
            return {
                chartObjects: nullData,
                deviceRows: null,
                data: {}
            };
        }, //end getInitialState
        loadData: function() {
            //for perf data
            $.ajax({
                type : 'GET',
                url : "getalertsdata",
                data : {type : 'Infra', requestType :"getEntitledTree"},
                dataType : "json",
                async : false,
                cache : false,
                success : function(data) {
                    //console.log("data");
                    if(data != "error"){
                        this.setState({data: data});
                    }
                    else {
                        console.log('What happened?');
                    }
                }.bind(this),
                error : function(error){
                    //alert('We encountered an error');
                    $('#data').html(JSON.stringify(error));
                    //this.setState({data: error});
                }.bind(this)
            });
            this.parseData();
        },
        parseData: function() {
            //this.state.chartObjects.push(this.state.data);
            this.setChartObjectsToDeviceRows();
            //this.state.chartObjects.push( this.state.data[1] );
        }, //end parseData
        setChartObjectsToDeviceRows: function() {
            console.log('tableReact setChartObjectsToDeviceRows');
            var devices = [];
            for(i=0;i<this.state.chartObjects.length;i++) {
                if (typeof this.state.chartObjects[i] ==! 'undefined') { //was ==!
                    devices.push(<rowOfData data={this.state.chartObjects[i]} />);
                }
            }
            this.setState({deviceRows: devices});
        }, //end setChartObjectsToDeviceRows
        componentWillMount: function() {
            this.loadData();
            //setInterval(this.loadData, 2000);
        }, //end componentDidMount
        addDevice: function() {
            this.setChartObjectsToDeviceRows();
            this.forceUpdate();
        }, //end addItem
        render: function() {
            return (
                <div>
                    <h1>Devices From Server</h1>
                string caps
                    <h2>{this.state.data}</h2>
                    <table>
                        <th>Alerts</th>
                    	{this.state.deviceRows}
                    </table>
                    <button onClick={this.addDevice}>Change to Devices </button>
                    <button onClick={this.addDevice}>Change to Values </button>
                </div>
                ); //end return
        } //end render
    }); //end tableReact

var rowOfData =
    React.createClass({
        render: function() {
            return (
                <tr>
                    <pointOfData dataPassed={this.props.data}/>
                </tr>
                );
        }//end render
    }); //end of rowOfData

var pointOfData=
    React.createClass({
        render:function(){
            return (
                <td>{this.props.dataPassed}</td>
                ); //end return
        }//end render
    }); //end of pointOfData

var MainReact =
    React.createClass({
        componentDidMount: function() {
            console.log('MainReact componentDidMount');
        },
        render: function() {
            return (
                <div>
                    <tableReact/>
                </div>
                );
        }
    });

React.renderComponent(
    <MainReact/>,
    document.getElementById('appJSX')
);