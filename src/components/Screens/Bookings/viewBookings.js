import React from "react";
import {View,Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, ToastAndroid} from "react-native"
import axios from "axios";
import moment from "moment"
import global from "../../Utils/global"



const numColumns = 1


function ViewBookings (props)
{
    const [userBookings, setUserBookings] = React.useState([])
    const getUserBookings = function getUserBookings ()
    {
        const requestOptions =
        {
            url: `http://192.168.0.110:3000/api/v1/bookings/userbookings/${global.g_username}`,
            responseType: "json",
            method: "GET"
        }
        axios(requestOptions).then(function (result)
        {
            if (result.data.length > 0)
            {
                setUserBookings(result.data)
            }
        })
        .catch(function (err)
        {
            console.log(err)
        })
    }


    React.useEffect(function ()
    {
        getUserBookings()
    }, [])


    const cancelFlight = function cancelFlight (item_flight, index)
    {
        const requestOptions =
        {
            url: `http://192.168.0.110:3000/api/v1/bookings/userbookings/cancelbooking`,
            responseType: "json",
            method: "POST",
            data:
            {
                username: global.g_username,
                booking_id: item_flight.id,
                flight_id: item_flight.flight_id
            }
        }

        axios(requestOptions).then(function (result)
        {
            if(result.data.message == "Succesfully cancelled booking")
            {
                var userBookingLocal = userBookings.filter(function (booking)
                {
                    if (booking.destination != item_flight.destination)
                    {
                        return booking
                    }
                })
                ToastAndroid.show(result.data.message, ToastAndroid.SHORT)
                setUserBookings(userBookingLocal)
                props.navigation.navigate("Flights", {data: item_flight})
            }
        })
        .catch(function (err)
        {
            console.log(err)
        })
    }

    return (
        <View style={styles.container}>
            <Text>My Bookings</Text>
            <FlatList
                data={userBookings}
                renderItem={({item, index}) => (
                    <View style={styles.dashboardContent}>
                            <View style={{backgroundColor: "#9FE2BF",alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5}}>
                                <Text style={[styles.titleText, {color: "#023020", marginTop: 15}]}>{item.destination}</Text>
                                <Text style={[styles.titleValue, {color: "#023020"}]}>R{item.price}</Text>

                                <View style={{flex: 1, flexDirection: "row", marginTop: 5}}>
                                    <View style={{paddingBottom: 10, marginBottom: 5, marginTop: 15, marginRight: 20}}>
                                        <Text style={{fontSize: 18, color: "#023020", marginBottom: 10, fontWeight: "900"}}>Date Of Booking</Text>
                                        <Text style={{fontSize: 14, color: "#023020"}}>Date: {moment(item.date_of_booking).format("YYYY-MM-DD")}</Text>
                                        <Text style={{fontSize: 14, color: "#023020"}}>Time: {moment(item.date_of_booking, "YYYY-MM-DDTHH:mm:ss").format("HH:mm:ss")}</Text>
                                    </View>
                                </View>
                                
                                <View style={{flex: 1, flexDirection: "row", marginTop: 5}}>
                                    <View style={{paddingBottom: 10, marginBottom: 5, marginTop: 15, marginRight: 20}}>
                                        <Text style={{fontSize: 18, color: "#023020", marginBottom: 10, fontWeight: "900"}}>Departure</Text>
                                        <Text style={{fontSize: 14, color: "#023020"}}>Date: {moment(item.departure_time).format("YYYY-MM-DD")}</Text>
                                        <Text style={{fontSize: 14, color: "#023020"}}>Time: {moment(item.departure_time, "YYYY-MM-DDTHH:mm:ss").format("HH:mm:ss")}</Text>
                                    </View>


                                    <View style={{paddingBottom: 10, marginBottom: 5, marginTop: 15, marginLeft: 20}}>
                                        <Text style={{fontSize: 18, color: "#023020", marginBottom: 10, fontWeight: "900"}}>Arrival</Text>
                                        <Text style={{fontSize: 14, color: "#023020"}}>Date: {moment(item.arrival_time).format("YYYY-MM-DD")}</Text>
                                        <Text style={{fontSize: 14, color: "#023020"}}>Time: {moment(item.arrival_time, "YYYY-MM-DDTHH:mm:ss").format("HH:mm:ss")}</Text>
                                    </View>
                                </View>
                      
                            </View>
                            
           
                        <TouchableOpacity style={
                        {
                            height: 60,
                            backgroundColor: "orange",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            marginBottom: 15
                            
                        }}
                        onPress={()=> cancelFlight (item, index)}>
                            <Text style={{color: "#212121", fontWeight: "900"}}>Cancel Flight</Text>
                        </TouchableOpacity>
    
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
            />
        </View>
    )
}
 
const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20
    },
    generalInfoContainer:
    {
        flex: 1,
    },
    generInfoText:
    {
        fontSize: 20,
        color: "#212121",
        textAlign: "center"
    }
    ,dashboardContent:
    {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
    }
    ,titleText:
    {
        fontSize: 15,
        textAlign: "center"
    }
    ,
    titleValue:
    {
        fontSize: 30,
        textAlign: "center",
        marginTop: 10
    }
})

export default ViewBookings