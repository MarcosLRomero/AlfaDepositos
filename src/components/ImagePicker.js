import { useState } from 'react';
import { View, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import Button from '@components/Button';
import { newTaskStyles } from '@styles/TaskStyle';
// import placeholder from '@icons/placeholder.png'

export default function ImagePick(props) {
  const [isLoading, setIsLoading] = useState(false)
  const { image, setImage, imageCompressed, setImageCompressed } = props

  const uploadImage = async () => {
    try {
      setIsLoading(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Se necesitan permisos de cámara para continuar.');
        return;
      }

      let images = [...image]; // Mantener las imágenes ya seleccionadas
      let compressedImages = [...imageCompressed]; // Mantener las imágenes comprimidas

      let keepTakingPictures = true;

      while (keepTakingPictures && images.length < 5) {
        let result = await ImagePicker.launchCameraAsync({
          cameraType: 'front',
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          aspect: [4, 3],
          quality: 0.4,
          base64: true,
        });

        if (!result.canceled) {
          const imageBase64 = result.assets[0].base64;
          images.push(imageBase64);

          const compressedImage = await compressImage(result.assets[0].uri);
          compressedImages.push(compressedImage.base64);

          if (images.length < 5) {
            keepTakingPictures = await new Promise((resolve) =>
              Alert.alert(
                'Tomar otra foto',
                `Has tomado ${images.length} fotos. ¿Deseas tomar otra? (máximo 5)`,
                [
                  { text: 'No', onPress: () => resolve(false) },
                  { text: 'Sí', onPress: () => resolve(true) },
                ],
                { cancelable: false }
              )
            );
          } else {
            Alert.alert('Límite alcanzado', 'Ya has tomado el máximo de 5 fotos.');
            keepTakingPictures = false;
          }
        } else {
          keepTakingPictures = false;
        }
      }

      setImage(images);
      setImageCompressed(compressedImages);
    } catch (error) {
      Alert.alert('Error subiendo imagen: ', error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  const pickImage = async () => {
    try {
      setIsLoading(true);

      let currentImagesCount = image.length;

      // Limitar la cantidad de imágenes que se pueden seleccionar, basando en las imágenes ya seleccionadas
      let selectionLimit = 5 - currentImagesCount;

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: selectionLimit, // Limitar la selección múltiple para no pasar de 5
        aspect: [4, 3],
        quality: 0.4, // Mayor compresión
        base64: true,
      });

      if (!result.canceled) {
        let newImages = result.assets.map((asset) => asset.base64);
        let compressedImages = await Promise.all(
          result.assets.map(async (asset) => {
            const compressedImage = await compressImage(asset.uri);
            return compressedImage.base64;
          })
        );

        // Añadir las nuevas imágenes a las existentes, pero sin pasar el límite de 5
        const totalImages = [...image, ...newImages].slice(0, 5);
        const totalCompressedImages = [...imageCompressed, ...compressedImages].slice(0, 5);

        setImage(totalImages);
        setImageCompressed(totalCompressedImages);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error subiendo imagen: ', error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  const compressImage = async (uri) => {
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 500 } }], // Cambiar el tamaño de la imagen
      { compress: 0.1, format: 'jpeg', base64: true } // Reducir la calidad y convertir a base64
    );
    return manipResult;
  };

  const deleteImage = () => {
    setImage([]);
    setImageCompressed([]);
  }

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Desea eliminar las imágenes?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        { text: 'Eliminar', onPress: () => deleteImage() },
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      
      {isLoading && <ActivityIndicator style={[newTaskStyles.loader, { margin: 60 }]} size="large" color="#00ff00" />}

      <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginVertical: 15 }}>
        <View>
          <Button icon="camera" onPress={uploadImage} />
        </View>

        <View style={{ marginHorizontal: 20}}>
          <Button icon="image" bgColor="darkgreen" onPress={pickImage} />
        </View>

        <View>
          <Button
            disabled={image.length === 0 && imageCompressed.length === 0}
            icon="trash"
            bgColor="red"
            onPress={handleDelete}
          />
        </View>
      </View>
      
      {/* <View style={styles.container}>
        <Text>
          Permission status: {permission?.status}.
        </Text>

        <Button label="Solicitar permisos" onPress={requestPermission} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    marginRight: 10,
  }
});
