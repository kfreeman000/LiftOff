import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('workoutDB.db'); // Open the SQLite database

const DisplayWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);

  // Function to fetch all workouts from the database
  const fetchWorkouts = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM workouts', // SQL query to fetch all workouts
        [],
        (tx, result) => {
          const allWorkouts = [];
          for (let i = 0; i < result.rows.length; i++) {
            allWorkouts.push(result.rows.item(i)); // Push each row (workout) into the array
          }
          setWorkouts(allWorkouts); // Set the state with the fetched data
        },
        (tx, error) => {
          console.error('Error fetching workouts:', error);
          Alert.alert('Error fetching workouts.');
        }
      );
    });
  };

  // Use useEffect to fetch workouts when the component mounts
  useEffect(() => {
    fetchWorkouts(); // Fetch workouts when component mounts
  }, []);

  // Render each workout item in a FlatList
  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <Text>Exercise: {item.exercise}</Text>
      <Text>Reps: {item.reps}</Text>
      <Text>Weight: {item.weight} lbs</Text>
      <Text>Comments: {item.comments}</Text>
      <Text>Media: {item.media ? JSON.parse(item.media).map((m, index) => <Text key={index}>{m.uri}</Text>) : 'No media uploaded'}</Text>
      <Text>--------------------</Text>
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Workout Log</Text>
      <FlatList
        data={workouts} // Data to render
        renderItem={renderItem} // Function to render each item
        keyExtractor={(item) => item.id.toString()} // Unique key for each workout item
      />
      <Button title="Refresh Workouts" onPress={fetchWorkouts} />
    </View>
  );
};

export default DisplayWorkouts;