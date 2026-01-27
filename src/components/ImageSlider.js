import { FlatList, Image, StyleSheet, View } from "react-native"

export default function ImageSlider({ images }) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={true}
        decelerationRate={0.9}
        persistentScrollbar={true}
        snapToAlignment="center"
        data={images}
        style={{ marginVertical: 20 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (item) {
            return (
              <View style={{ width: 250, height: '100%' }}>
                <View style={{ borderRadius: 34, alignItems: 'center' }}>
                  <Image source={{ uri: `data:image/png;base64,${item}` }} style={styles.image} />
                </View>
              </View>
            )
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
})
