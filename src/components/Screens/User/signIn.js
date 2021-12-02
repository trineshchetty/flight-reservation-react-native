import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, StyleSheet, ToastAndroid} from "react-native"
import axios from "axios"
import global from "../../Utils/global"



const LoginRegister = function (props)
{
    const [userState, setUserState] = React.useState("Register")
    const [loginRegisterMessage, setLoginRegisterMessage] = React.useState("Already have an account?")
    const [loginRegisterMessageEnd, setLoginRegisterMessageEnd] =  React.useState("Click to login")


    useEffect(function () {
        if (userState == "Register")
        {
            setLoginRegisterMessage("Already have an account?")
            setLoginRegisterMessageEnd("Click to login")
        }
        if (userState == "Login")
        {
            setLoginRegisterMessage("New here? ")
            setLoginRegisterMessageEnd("Click here to register")
        }
    })

    let methods =
    {
        login_signup: function login_signup (username, password)
        {
            if (!username == "" && !password == "")
            {
                if (userState == "Register")
                {
                    axios({
                        url: "http://192.168.0.110:3000/api/v1/users/register",
                        responseType: "json",
                        method: "POST",
                        data: 
                        {
                            username: username,
                            password: password
                        }
                    }).then(function (result)
                    {
                        if (result.data.error && result.data.error.message == "User already exists. Please log in")
                        {
                            setUserState("Login")
                            ToastAndroid.show("You are already registered. Please Log In", ToastAndroid.SHORT)
                        }
                        else
                        {
                            global.g_username = username
                            global.g_user_id = result.data.insertId
                            props.navigation.push("Flights")
                            ToastAndroid.show("You are registered", ToastAndroid.SHORT)
                            
                        }
                    })
                    .catch(function (err)
                    {
                        console.log(err)
                    })
                }

                if (userState == "Login")
                {
                    axios({
                        url: "http://192.168.0.110:3000/api/v1/users/login",
                        responseType: "json",
                        method: "POST",
                        data: 
                        {
                            username: username,
                            password: password
                        }
                    }).then(function (result)
                    {
            
                        const error_message = "User not found. Please register or check login credentials and try again."
                        if (result.data.message == error_message)
                        {
                            ToastAndroid.show(error_message, ToastAndroid.SHORT)
                        }

                        if (result.data.message == "Password is incorrect")
                        {
                            ToastAndroid.show(result.data.message, ToastAndroid.SHORT)
                        }
                        else
                        {
                            global.g_username = username
                            global.g_user_id = result.data.data[0].id
                            props.navigation.push("Flights")
                            ToastAndroid.show("Logging In", ToastAndroid.SHORT)
                        }
                    })
                    .catch(function (err)
                    {
                        console.log(err)
                    })
                }
            }
            else
            {
                ToastAndroid.show("Username and password cannot be empty", ToastAndroid.SHORT)
            }
        }
    }

 
    function RenderSignInButton (props)
    {

        return (
            <View style={{margin: 30}}>

                <TouchableOpacity style={
                    {
                        height: 60,
                        backgroundColor: "green",
                        alignItems: "center",
                        justifyContent: "center"
                        
                    }}
                    onPress={()=>methods.login_signup(props.credentials.username, props.credentials.password)}>
                        <Text style={{color: "white"}}>{userState}</Text>
                    </TouchableOpacity>

            </View>
        )
    }

    function RenderForm ()
    {
        const [username, onChangeUsername] = React.useState();
        const [password, onChangePassword] = React.useState();
    
        return (
            <View
                style={{
                    marginTop: 80,
                    marginHorizontal: 30
                }}
            >

            <View style={{marginTop: 50}}>
                <Text style={{color: "#212121"}}>Username</Text>
                <TextInput 
                    style={{
                        marginVertical: 10,
                        borderBottomColor: "#212121",
                        borderBottomWidth: 1,
                        height: 40,
                        color: "#212121"
                    }}
                    onChangeText={onChangeUsername}
                    value={username}
                    autoFocus={true}
                    placeholder="Enter Username"
                    placeholderTextColor="#212121"
                    selectionColor="#212121"
                />
            </View>

            <View style={{marginTop: 20}}>
                <Text style={{color: "#212121"}}>Password</Text>
                <TextInput style={{ marginVertical: 10, borderBottomColor: "#212121", borderBottomWidth: 1, height: 40, color: "#212121" }}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder="Enter Password"
                    placeholderTextColor="#212121"
                    selectionColor="#212121">    
                </TextInput>
           
            </View>
                <RenderSignInButton credentials={{username: username, password: password}}/>

 
            </View>

            
        )
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <RenderForm />

            <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                <Text>
                  {loginRegisterMessage}<Text style={{color: "lightblue", fontWeight: "600"}} onPress={() => {
                      if (userState == "Register")
                      {
                        setUserState("Login")
                      }
                      if (userState == "Login")
                      {
                        setUserState("Register")
                      }
                  } }> {loginRegisterMessageEnd}</Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        marginTop: 10,
    }
})


export default LoginRegister