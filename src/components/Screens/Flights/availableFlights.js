import React from "react";
import {View,Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, ToastAndroid} from "react-native"
import axios from "axios";
import moment from "moment"
import global from "../../Utils/global"



const numColumns = 1


function AvailableFlights (props)
{

    const [flights, setFlights] = React.useState([])
    const getAllAvailableFlights = function getAllAvailableFlights ()
    {
        const requestOptions =
        {
            url: "http://192.168.0.110:3000/api/v1/flights/getall",
            responseType: "json",
            method: "GET"
        }
        axios(requestOptions).then(function (result)
        {
            if (result.data.length > 0)
            {
                setFlights(result.data)
            }
        })
        .catch(function (err)
        {
            console.log(err)
        })
    }

    let flight_data = flights

    

    React.useEffect(function ()
    {
        getAllAvailableFlights()
    }, [])


    const BookFlight = function BookFlight (item_flight, index)
    {
        const bookingData =
        {
            user_id: global.g_user_id,
            flight_id: item_flight.id,
            username: global.g_username
        }



        if (item_flight.available_space == 0)
        {
            ToastAndroid.show("No Space Available. Please check in later for possible open space.", ToastAndroid.SHORT)
        }

        const requestOptions =
        {
            url: `http://192.168.0.110:3000/api/v1/bookings/userbookings/bookflight`,
            responseType: "json",
            method: "POST",
            data: bookingData
        }

        axios(requestOptions).then(function (result)
        {

            if(result.data.message == "Succesfully made booking")
            {
                ToastAndroid.show(result.data.message, ToastAndroid.SHORT)

                var updateAvailableSpace = flight_data.map(function (flight)
                {
                    if (flight.id == item_flight.id)
                    {
                        flight.available_space --
                        return flight
                    }
                    return flight
                    
                })
                setFlights(updateAvailableSpace)
            }
            else
            {
                if (result.data.error)
                {
                    ToastAndroid.show(result.data.error, ToastAndroid.SHORT)
                }
            }
        })
        .catch(function (err)
        {
            console.log(err)
        })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.viewBookingsContainer}
                onPress={()=> props.navigation.push("Bookings")}>
                    <Text style={{color: "#232323", fontWeight: "900", fontSize: 18}}>View My Bookings</Text>
            </TouchableOpacity>

            <FlatList
                data={flights}
                renderItem={({item}) => (
                    <View style={styles.dashboardContent}>
                     
                            <View style={{backgroundColor: "grey",alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5}}>
                                <Text style={[styles.titleText, {color: "white", marginTop: 15}]}>{item.destination}</Text>
                                <Text style={[styles.titleValue, {color: "white"}]}>R{item.price}</Text>
                                

                                <View style={{flex: 1, marginBottom: 5, marginTop: 10}}>
                                    <Text style={{fontSize: 15, color: "white"}}>Spots Left: {item.available_space}</Text>
                                </View>

                                <View style={{flex: 1, flexDirection: "row", marginTop: 5}}>
                                    <View style={{paddingBottom: 10, marginBottom: 5, marginTop: 15, marginRight: 20}}>
                                        <Text style={{fontSize: 18, color: "white", marginBottom: 10, fontWeight: "900"}}>Departure</Text>
                                        <Text style={{fontSize: 14, color: "white"}}>Date: {moment(item.departure_time).format("YYYY-MM-DD")}</Text>
                                        <Text style={{fontSize: 14, color: "white"}}>Time: {moment(item.departure_time, "YYYY-MM-DDTHH:mm:ss").format("HH:mm:ss")}</Text>
                                    </View>


                                    <View style={{paddingBottom: 10, marginBottom: 5, marginTop: 15, marginLeft: 20}}>
                                        <Text style={{fontSize: 18, color: "white", marginBottom: 10, fontWeight: "900"}}>Arrival</Text>
                                        <Text style={{fontSize: 14, color: "white"}}>Date: {moment(item.arrival_time).format("YYYY-MM-DD")}</Text>
                                        <Text style={{fontSize: 14, color: "white"}}>Time: {moment(item.arrival_time, "YYYY-MM-DDTHH:mm:ss").format("HH:mm:ss")}</Text>
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
                        onPress={()=> BookFlight(item)}>
                            <Text style={{color: "#212121", fontWeight: "900"}}>Book Flight</Text>
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
    viewBookingsContainer:
    {
        flex: 1,
        justifyContent: "center",
        alignItems: "center", 
        padding: 10, 
        marginBottom: 15,
        backgroundColor: "#96DED1",
        borderRadius: 10,
        padding: 30, 

    },

    dashboardContent:
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

export default AvailableFlights