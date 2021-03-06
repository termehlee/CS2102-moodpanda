import React, { Component } from 'react'
import { Dropdown, Grid, Segment, Statistic } from 'semantic-ui-react'
import axios from 'axios';
import DeliveryTable from './DeliveryTable';

const monthOptions = [
    { key: 'Ja', value: 'Ja', flag: 'Ja', text: 'January' },
    { key: 'Fe', value: 'Fe', flag: 'Fe', text: 'February' },
    { key: 'Mr', value: 'Mr', flag: 'Mr', text: 'March' },
    { key: 'Ap', value: 'Ap', flag: 'Ap', text: 'April' },
    { key: 'Ma', value: 'Ma', flag: 'Ma', text: 'May' },
    { key: 'Jn', value: 'Jn', flag: 'Jn', text: 'June' },
    { key: 'Jl', value: 'Jl', flag: 'Jl', text: 'July' },
    { key: 'Au', value: 'Au', flag: 'Au', text: 'August' },
    { key: 'Se', value: 'Se', flag: 'Se', text: 'September' },
    { key: 'Oc', value: 'Oc', flag: 'Oc', text: 'October' },
    { key: 'No', value: 'No', flag: 'No', text: 'November' },
    { key: 'De', value: 'De', flag: 'De', text: 'December' },
]
class Summary extends Component {
    constructor(props) {
        super(props);
        var d = new Date();
        this.state = {
            totalOrders: '',
            newCustomers: '',
            orderDetails: '',
            totalSales: 0,
            monthIndex: d.getMonth(),
            deliveryInfo: '',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        console.log("Summary Mounted");
        axios.get('/manager/api/get/getMonthTotalOrders', { params: { monthSelected: this.state.monthIndex+1 } }).then(res => {
            this.setState({ totalOrders: res.data.length })
            this.setState({ orderDetails: res.data })
            this.setState({
                isLoading: false,
            })
            //calculate total sales
            let orders = this.state.orderDetails.map(item => {
                return {
                    orid: item.orid,
                    cost: item.cartcost,
                    deliveredTime: item.deliveredtime
                }
            })
            let sum = 0;
            for(let i = 0; i < orders.length; i++) {
                sum += orders[i].cost;
            }
            this.setState({ totalSales: sum })
        }).catch(err => console.log(err))

        axios.get('/manager/api/get/getNewCustomers', { params: { monthSelected: this.state.monthIndex+1 } }).then(res => {
            this.setState({ newCustomers: res.data.length })
            this.setState({
                isLoading: false,
            })
        }).catch(err => console.log(err))

        axios.get('/manager/api/get/getDeliveryCountByArea').then(res => {
            this.setState({ deliveryInfo: res.data })
            console.log("Delivery info\n", res.data);
        }).catch(err => console.log(err))
    }

    handleChange = (e, {value}) => {
        console.log(value);
        let index;
        for (let i = 0; i < monthOptions.length; i++) {
            if (monthOptions[i].value === value) {
                index = i;
            }
        }
        this.setState({
            monthIndex: index
        });
        console.log(this.state.monthIndex)
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.monthIndex !== this.state.monthIndex) {
            axios.get('/manager/api/get/getMonthTotalOrders', { params: { monthSelected: this.state.monthIndex+1 } }).then(res => {
                this.setState({ totalOrders: res.data.length })
                this.setState({ orderDetails: res.data })
                this.setState({
                    isLoading: false,
                })
                //calculate total sales
                let orders = this.state.orderDetails.map(item => {
                    return {
                        orid: item.orid,
                        cost: item.cartcost,
                        deliveredTime: item.deliveredtime
                    }
                })
                let sum = 0;
                for(let i = 0; i < orders.length; i++) {
                    sum += orders[i].cost;
                }
                this.setState({ totalSales: sum })
            }).catch(err => console.log(err))

            axios.get('/manager/api/get/getNewCustomers', { params: { monthSelected: this.state.monthIndex+1 } }).then(res => {
                this.setState({ newCustomers: res.data.length })
                this.setState({
                    isLoading: false,
                })
            }).catch(err => console.log(err))
        }
    }

    render() {
        console.log("Delivery Info\n", this.state.deliveryInfo);
        return(
            <Grid columns={2} divided>
                <Grid.Row stretched>
                <Grid.Column>
                <Segment.Group>
                    <Segment size='big' textAlign='left'>
                    <Dropdown
                        defaultValue={monthOptions[this.state.monthIndex].value}
                        fluid
                        search
                        selection
                        options={monthOptions}
                        onChange={this.handleChange}
                    />
                    </Segment>
                    <Segment.Group>
                    <Segment>
                    <Statistic size='tiny'>
                        <Statistic.Label>Total Orders</Statistic.Label>
                        <Statistic.Value>{this.state.totalOrders}</Statistic.Value>
                    </Statistic>
                    </Segment>
                    <Segment>
                    <Statistic size='tiny'>
                        <Statistic.Label>Total New Customers</Statistic.Label>
                        <Statistic.Value>{this.state.newCustomers}</Statistic.Value>
                    </Statistic>
                    </Segment>
                    <Segment>
                    <Statistic size='tiny'>
                        <Statistic.Label>Total Sales from Orders</Statistic.Label>
                        <Statistic.Value>${this.state.totalSales}</Statistic.Value>
                    </Statistic>
                    </Segment>
                    </Segment.Group>
                </Segment.Group>
                </Grid.Column>
                <Grid.Column>
                    <Segment.Group>
                        <Segment textAlign='left' size='big'>Number of orders being delivered within the past hour</Segment>
                        <Segment.Group>
                        <DeliveryTable deliveryInfo={this.state.deliveryInfo}></DeliveryTable>
                    </Segment.Group>
                    </Segment.Group>   
                </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Summary