import React, { useState, useEffect } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";




export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  function renderTech({item}) {
    return (
      <Text style={styles.tech}>
        {item}
      </Text>
    );
  }
  
  function renderLikes(likes) {
    if (likes > 1) return `${likes} curtidas`
    return `${likes} curtida`
  }

  function renderRepository({item}) {
    return (
      <View key={item.id} style={styles.repositoryContainer}>
        <Text style={styles.repository}>{item.title}</Text>
  
        <View style={styles.techsContainer}>
          <FlatList 
            data={item.techs}
            renderItem={tech => renderTech(tech)}
            keyExtractor={tech => tech}
          />
        </View>
  
        <View style={styles.likesContainer}>
          <Text
            style={styles.likeText}
            // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
            testID={`repository-likes-${item.id}`}
          >
            {renderLikes(item.likes)}
          </Text>
        </View>
  
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLikeRepository(item.id)}
          // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
          testID={`like-button-${item.id}`}
        >
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
  async function handleLikeRepository(id) {
    const { data } = await api.post(`/repositories/${id}/like`);
    const newRepositories = repositories;
    newRepositories.forEach(repository => {
      if(repository.id === id) {
        repository.likes = data.likes;
      }
    });
    setRepositories([... newRepositories]);
  }  

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          renderItem={repository => renderRepository(repository)}
          keyExtractor={repository => repository.id}
        /> 
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
