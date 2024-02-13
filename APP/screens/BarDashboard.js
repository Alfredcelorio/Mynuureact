import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, TextInput, ActionSheetIOS, Modal } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Box, Text, Center, Input, NativeBaseProvider, Button, View  } from 'native-base';
import { ProgressCircle } from 'react-native-svg-charts';

const TaskProgressChart = ({ completedTasks, totalTasks }) => {
    const percentageCompleted = (completedTasks / totalTasks) * 100;
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 100, marginTop: 100 }}>
            <ProgressCircle
                style={{ height: 400, width: '80%' }}
                progress={percentageCompleted / 100}
                progressColor='green'
                strokeWidth={35}
            />
            <Text style={styles.percentagePosition} color="white" fontSize="4xl" fontWeight="bold" textAlign="center">
                {`20%`}
            </Text>
        </View>
    );
};

const initialChecklists = [
    { id: '1', name: 'Checklist 1', tasks: [{ key: '1', label: 'Hello', completed: false }] },
];

export default function App() {
    const [checklists, setChecklists] = useState(initialChecklists);
    const [activeChecklistId, setActiveChecklistId] = useState('1');
    const [newTask, setNewTask] = useState('');
    const [editingKey, setEditingKey] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const getActiveChecklist = () => {
        return checklists.find(cl => cl.id === activeChecklistId) || checklists[0];
    }

    const toggleCompletion = (key) => {
        const updatedChecklists = checklists.map(cl => {
            if (cl.id === activeChecklistId) {
                return {
                    ...cl,
                    tasks: cl.tasks.map(task =>
                        task.key === key ? { ...task, completed: !task.completed } : task
                    )
                };
            }
            return cl;
        });
        setChecklists(updatedChecklists);
    };

    const addNewTask = () => {
        if (newTask.trim().length > 0) {
            const updatedChecklists = checklists.map(cl => {
                if (cl.id === activeChecklistId) {
                    return {
                        ...cl,
                        tasks: [
                            ...cl.tasks,
                            { key: Date.now().toString(), label: newTask, completed: false }
                        ]
                    };
                }
                return cl;
            });
            setChecklists(updatedChecklists);
            setNewTask('');
        }
    };

    const deleteTask = (key) => {
        const updatedChecklists = checklists.map(cl => {
            if (cl.id === activeChecklistId) {
                return {
                    ...cl,
                    tasks: cl.tasks.filter(task => task.key !== key)
                };
            }
            return cl;
        });
        setChecklists(updatedChecklists);
    };

    const startEditing = (key, label) => {
        setEditingKey(key);
        setEditingValue(label);
    };

    const finishEditing = () => {
        const updatedChecklists = checklists.map(cl => {
            if (cl.id === activeChecklistId) {
                return {
                    ...cl,
                    tasks: cl.tasks.map(task =>
                        task.key === editingKey ? { ...task, label: editingValue } : task
                    )
                };
            }
            return cl;
        });
        setChecklists(updatedChecklists);
        setEditingKey(null);
        setEditingValue('');
    };

    const addNewChecklist = () => {
        const newId = Date.now().toString();
        const newChecklistName = `Checklist ${checklists.length + 1}`;
        setChecklists(prevChecklists => [
            ...prevChecklists,
            { id: newId, name: newChecklistName, tasks: [] }
        ]);
        setActiveChecklistId(newId);
    };

    const showActionSheet = () => {
        let options = checklists.map(cl => cl.name);
        options.push("Add a Checklist");
        options.push("Cancel");

        let cancelButtonIndex = options.length - 1;

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                userInterfaceStyle: 'dark',
            },
            buttonIndex => {
                if (buttonIndex === options.length - 2) {
                    addNewChecklist();
                } else if (buttonIndex !== cancelButtonIndex) {
                    setActiveChecklistId(checklists[buttonIndex].id);
                }
            },
        );
    };

    const activeChecklist = getActiveChecklist();
    const completedTasks = activeChecklist.tasks.filter(task => task.completed).length;

    const renderLeftActions = (progress, dragX, item) => {
        return (
            <Box flexDirection="row" height={50} backgroundColor="black">
                <TouchableOpacity onPress={() => startEditing(item.key, item.label)} style={styles.editBox}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.key)} style={styles.deleteBox}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </Box>
        );
    };

    const renderItem = ({ item, drag, isActive }) => {
        if (editingKey === item.key) {
            return (
                <TextInput
                    style={styles.input}
                    value={editingValue}
                    onChangeText={setEditingValue}
                    onBlur={finishEditing}
                    autoFocus
                />
            );
        }

        return (
            <Swipeable renderRightActions={(progress, dragX) => renderLeftActions(progress, dragX, item)}>
                <TouchableOpacity
                    onLongPress={drag}
                    onPress={() => toggleCompletion(item.key)}
                    style={[
                        styles.rowItem,
                        { backgroundColor: isActive ? "red" : item.completed ? 'green' : 'black' },
                    ]}
                >
                    <Text style={styles.text}>{item.label}</Text>
                </TouchableOpacity>
            </Swipeable>
        );
    };

    return (
        <NativeBaseProvider> 
            <GestureHandlerRootView style={styles.container}> 
            <Center flex={1}>
          <Text color="white" fontSize="5xl" bold>
            Bar Cost
          </Text>
        </Center>
                <TaskProgressChart completedTasks={completedTasks} totalTasks={activeChecklist.tasks.length} />
                <View style={styles.taskListContainer}>
                    <DraggableFlatList
                        data={activeChecklist.tasks}
                        onDragEnd={({ data }) => {
                            const updatedChecklists = checklists.map(cl => {
                                if (cl.id === activeChecklistId) {
                                    return { ...cl, tasks: data };
                                }
                                return cl;
                            });
                            setChecklists(updatedChecklists);
                        }}
                        keyExtractor={(item) => item.key}
                        renderItem={renderItem}
                        contentContainerStyle={{ backgroundColor: 'black' }}
                    />
                </View>
                <View style={styles.footer}>
                <Button
  onPress={() => {/* handle add sales */}}
  variant="outline"
  colorScheme="222" // This uses the 'secondary' color scheme from the theme
  style={styles.button}>
  Add Sales
</Button>

<Button
  onPress={() => {/* handle add purchases */}}
  colorScheme= "#222" // This uses the 'primary' color scheme from the theme
  _text={{ color: 'white' }} // Text color, often white is used for better readability on solid buttons
  style={styles.button}>
  Add Purchases
</Button>

                  </View>
                
            </GestureHandlerRootView>
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({

  
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    percentagePosition: {
        position: 'absolute',
    },
    rowItem: {
        height: 50,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    footer: {
        paddingBottom: 10,
        backgroundColor: 'black',
    },
    deleteBox: {
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 50,
    },
    deleteText: {
        color: 'white',
        paddingHorizontal: 10,
        fontWeight: 'bold',
    },
    editBox: {
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 50,
    },
    editText: {
        color: 'white',
        paddingHorizontal: 10,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        marginTop: 10,
        paddingHorizontal: 10,
        fontSize: 18,
        color: 'white',
        backgroundColor: 'black',
    },
    addButton: {
        width: '95%',
        alignSelf: 'center',
        marginBottom: 20
    },
    taskListContainer: {
        flex: 1,
    },
    footer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 10,
      paddingBottom: 20, // Consider safe area insets for devices with a bottom notch
      backgroundColor: 'black', // Change as per your design
    },
    button: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    
    },
});
