import { TouchableOpacity, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function Button ({ label, disabled, onPress, icon, iconSize = 24, bgColor = '#355A99', iconColor = 'white' }) {
  const iconStyle = 'w-16 h-16 rounded-full items-center justify-center'

  return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{ backgroundColor: disabled ? '#d1d5db' : bgColor, padding: 20, paddingVertical: 10 }}
      >
        {icon
          ?
            <Ionicons name={icon} size={iconSize} color={iconColor} onPress={onPress} />
          :
            <Text className='font-semibold text-md text-center uppercase text-white'>
              {label}
            </Text>
        }
      </TouchableOpacity>
  )
}
