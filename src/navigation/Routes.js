import * as React from "react"
import {NavigationContainer} from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack';





// // Components
import SignInRegister from "../components/Screens/User/signIn"
import FlightScreen from "../components/Screens/Flights/availableFlights"
import UserBookingsScreen from "../components/Screens/Bookings/viewBookings"

const Stack = createStackNavigator();

function Routes() {
  return (
	<NavigationContainer>
    	<Stack.Navigator>
      		<Stack.Screen name="Register" component={SignInRegister} />
			<Stack.Screen name="Flights" component={FlightScreen} />
			<Stack.Screen name="Bookings" component={UserBookingsScreen} />
    	</Stack.Navigator>
	</NavigationContainer>
  );
}



export default Routes