import React, { useEffect, useState } from 'react'
import { StatusBar, View, SafeAreaView, Text, Image, AsyncStorage, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import io from 'socket.io-client'
import api from '../services/api'
import Logo from '../../assets/logo.png'
import Like from '../../assets/like.png'
import Unlike from '../../assets/dislike.png'
import itsamatch from '../../assets/itsamatch.png'


export default Main = (({ navigation }) => {
  const id = navigation.getParam('user')
  const [users, setUsers] = useState([])
  const [matchDev, setMatchDev] = useState(null)
  console.log(id)
  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id
        }
      })
      setUsers(response.data)
    }
    loadUsers()
  }, [id])

  useEffect(() => {
    const socket = io('http://192.168.1.107:3333', {
      query: { user: id }
    })
    socket.on('match', dev => {
      setMatchDev(dev)
    })
  }, [id])

  async function handleUnlike() {
    const [user, ...rest] = users
    await api.post(`/devs/${user._id}/unlikes`, null, {
      headers: { user: id }
    })
    setUsers(rest)
  }

  async function handleLike() {
    const [user, ...rest] = users
    await api.post(`/devs/${user._id}/likes`, null, {
      headers: { user: id }
    })
    setUsers(rest)
  }

  async function handleLogout() {
    await AsyncStorage.clear()
    navigation.navigate('Login')
  }

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <Image source={Logo} style={styles.logo} />

      <View style={styles.stylecard}>
        {users.length === 0
          ? <Text style={styles.empty}> Acabou :( </Text>
          : (
            users.map((user, index) => (
              <View key={user._id} style={[styles.cardC, { zIndex: 0 }]} >
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.footer}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                </View>
              </View>
            ))
          )
        }
      </View>
      {users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleUnlike} style={styles.button}>
            <Image source={Unlike} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLike} style={styles.button}>
            <Image source={Like} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.return}>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={{ fontWeight: "bold", color: "#FFF", fontSize: 16 }}>Logoff</Text>
        </TouchableOpacity>
      </View>


      {matchDev && (
        <View style={styles.matchContainer} >
          <Image source={itsamatch} style={styles.match} />
          <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>
          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.closeMatch}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView >
  )
})

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    marginTop: 50,
    paddingTop: 0
  },
  empty: {
    alignSelf: "center",
    color: "#999",
    fontSize: 24,
    fontWeight: "bold"
  },
  stylecard: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 500,

  },
  cardC: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
    margin: 30,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  avatar: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  bio: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    lineHeight: 20
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 30,
    zIndex: 0,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  return: {
    height: 50,
    width: 450,
    backgroundColor: "#df4723",
    marginBottom: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  logout: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1
  },
  match: {
    height: 60,
    resizeMode: "contain",
  },
  matchAvatar: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 5,
    borderColor: "#FFF",
    marginVertical: 30,
  },
  matchName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF"
  },
  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 30
  },
  closeMatch: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 30,
    fontWeight: "bold"
  }
})