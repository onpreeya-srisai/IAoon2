import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  updateIMGUser,
  updateUser,
  deleteUser,
} from "../../redux/slice/userSlice";
import SelectDropdown from "react-native-select-dropdown";
import { Login } from "./auth/Login";
import * as UserModel from "../../firebase/userModel";
import * as AuthModel from "../../firebase/authModel";

export const Account = (props) => {
  const navigation = props.nav;

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const selectSex = ["female", "male"];

  const FindAccount = (user) => {
    user = user.user;
    if (user.length > 0) {
      const getImage = user[0].img;
      const [image, setImage] = useState(getImage);
      const [username, setUsername] = useState(user[0].username);
      const [firstName, setFirstName] = useState(user[0].firstName);
      const [lastName, setLastName] = useState(user[0].lastName);
      const [sex, setSex] = useState(user[0].sex);

      let openImagePickerAsync = async () => {
        let perm = await ImagePicker.requestCameraPermissionsAsync();
        if (perm === false) {
          Alert("Allow access to your files.");
          return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
          return;
        }
        setImage(pickerResult.uri);
        dispatch(updateIMGUser({ img: pickerResult.uri }));
        UserModel.editUser(
          user[0].id,
          username,
          firstName,
          lastName,
          sex,
          pickerResult.uri,
          success
        );
        dispatch(
          updateUser({
            username: username,
            firstName: firstName,
            lastName: lastName,
            sex: sex,
          })
        );
        // Alert.alert('Save your image already');
      };

      const success = () => {
        dispatch(
          updateUser({
            username: username,
            firstName: firstName,
            lastName: lastName,
            sex: sex,
          })
        );
        Alert.alert("Save your proflie already");
      };

      const editProfile = () => {
        UserModel.editUser(
          user[0].id,
          username,
          firstName,
          lastName,
          sex,
          image,
          success
        );
      };

      const logOutProfile = () => {
        AuthModel.signOut(deleteUserStore, unsuccess);
      };

      const deleteUserStore = () => {
        dispatch(deleteUser(user[0]));
        console.log("Log out Profile");
      };

      const unsuccess = (msg) => {
        console.log(msg);
        Alert.alert(msg);
      };

      const rePassword = () => {
        navigation.navigate("ChangePassword");
      };

      return (
        <View style={{ flex: 8, flexDirection: "column" }}>
          <View
            style={{
              flex: 1.5,
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 24,
            }}
          >
            <View style={{ height: 100, width: 100 }}>
              <TouchableOpacity onPress={openImagePickerAsync}>
                <Image
                  style={{ width: "100%", height: "100%", borderRadius: 100 }}
                  source={{ uri: image }}
                ></Image>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20, color: "#9AD3DA", paddingTop: 10 }}>
              รูปโปรไฟล์
            </Text>
          </View>
          <View
            style={{
              flex: 4,
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 0,
            }}
          >
            <TextInput
              placeholder="Username"
              placeholderTextColor="black"
              value={username}
              onChangeText={(un) => {
                setUsername(un);
              }}
              style={[styles.textInput, { marginTop: 30 }]}
            />
            <TextInput
              placeholder="FirstName"
              placeholderTextColor="black"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.textInput}
            />
            <TextInput
              placeholder="LastName"
              placeholderTextColor="black"
              value={lastName}
              onChangeText={setLastName}
              style={styles.textInput}
            />

            <SelectDropdown
              data={selectSex}
              defaultButtonText={sex}
              onSelect={(selectedItem, index) => {
                setSex(selectedItem);
              }}
              renderDropdownIcon={(focused) => {
                return (
                  <Entypo
                    name={focused ? "chevron-small-down" : "chevron-small-up"}
                    size={32}
                    color="#000000"
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={{ backgroundColor: "#9AD3DA" }}
              buttonStyle={{
                backgroundColor: "#9AD3DA",
                marginTop: 13,
                width: 350,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 40,
              }}
              buttonTextStyle={{ fontSize: 20, textAlign: "left" }}
            />

            <TouchableOpacity
              onPress={rePassword}
              style={{ alignSelf: "flex-end", paddingRight: "8%" }}
            >
              <Text
                style={{
                  fontSize: 16,
                  paddingTop: 10,
                  color: "#9AD3DA",
                  textDecorationLine: "underline",
                }}
              >
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderWidth: 0,
              borderColor: "yellow",
              marginBottom: 40,
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={editProfile} style={styles.button}>
              <Text style={{ fontSize: 25 }}>edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={logOutProfile} style={styles.button}>
              <Text style={{ fontSize: 25 }}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (user.length <= 0) {
      // console.log("ไม่มีใครอยู่ก็ต้องออกอันนี้ดิ ออกนะ แต่เออเร่อทำไมก่อง");
      return <Login nav={navigation} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#191919", "#006262"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.6 }}
        style={styles.background}
      >
        <FindAccount user={user} />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'orange',
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  textInput: {
    width: 350,
    height: 48,
    fontSize: 20,
    backgroundColor: "#9AD3DA",
    marginLeft: "2%",
    borderWidth: 1,
    fontFamily: Platform.OS === "ios" ? "AppleSDGothicNeo-Thin" : "Roboto",
    borderRadius: 40,
    paddingLeft: 20,
    marginTop: 13,
  },
  button: {
    margin: 10,
    backgroundColor: "#FAA307",
    height: 48,
    width: 200,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
});
