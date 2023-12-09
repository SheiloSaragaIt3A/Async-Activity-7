import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";
import StudentList from './data/StudentList';
import { v4 as uuidv4 } from 'uuid';

const sHeight = Dimensions.get('window').height;

function HomeScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [course, setCourse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const addStudent = async () => {
    const newStudent = {
      ID: uuidv4(),
      firstName,
      lastName,
      course,
      username,
      password,
    };

    try {
      if (firstName !== '' && lastName !== '' && course !== '' && username !== '' && password !== '') {
        const existingStudents = JSON.parse(await AsyncStorage.getItem('students')) || [];
        const updatedStudents = [...existingStudents, newStudent];
        await AsyncStorage.setItem('students', JSON.stringify(updatedStudents));
  
        toast.show("Added Successfully", {
          placement: "center",
          duration: 1500,
          offset: 30,
        });

        setFirstName('');
        setLastName('');
        setCourse('');
        setUsername('');
        setPassword('');
      } else {
        toast.show("Please fill out all required fields before submitting the form.", {
          placement: "center",
          duration: 1500,
          offset: 30,
        });
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <Picker
        selectedValue={course}
        style={styles.input}
        mode={'dropdown'}
        onValueChange={(itemValue) => setCourse(itemValue)}>
        <Picker.Item label="Course" />
        <Picker.Item label="BS ELECTRONICS TECHNOLOGY" value="ELECTRONICS TECHNOLOGY" />
        <Picker.Item label="BS COMPUTER SCIENCE" value="BS COMPUTER SCIENCE" />
        <Picker.Item label="BS ELECTRICAL TECHNOLOGY" value="BS ELECTRICAL TECHNOLOGY" />
        <Picker.Item label="BSIT-FOOD PREPARATION SERVICES MANAGEMENT" value="BSIT-FOOD PREPARATION SERVICES MANAGEMENT" />
        <Picker.Item label="BS CRIMINOLOGY" value="BS CRIMINOLOGY" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={{ marginBottom: 30 }}>
        <Button title="ADD STUDENT" onPress={addStudent} />
      </View>
      <View style={{ marginBottom: 30 }}>
        <Button title="VIEW STUDENT'S LIST" onPress={() => navigation.navigate('Student List')} />
      </View>
    </View>
  );
}

function StudentLists({ navigation }) {
  const toast = useToast();

  const handleDeleteData = async () => {
    try {
      await AsyncStorage.clear();
      toast.show("Deleted Successfully", {
        placement: "center",
        duration: 1500,
        offset: 30,
      });
     
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <View style={{ backgroundColor: 'white' }}>
      <StudentList />
      <View style={{ marginBottom: 30 }}>
        <Button title="HOME" onPress={() => navigation.goBack()} />
      </View>
      <View style={{ marginBottom: 30 }}>
        <Button title="DELETE" onPress={handleDeleteData} color="red" />
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function AddStudentPage() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home page" component={HomeScreen} />
      <Stack.Screen name="Student List" component={StudentLists} />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ToastProvider>
        <NavigationContainer>
          <AddStudentPage />
        </NavigationContainer>
      </ToastProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: sHeight,
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default App;