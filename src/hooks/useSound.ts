import { useEffect, useState } from "react";
import { Audio } from "expo-av";

const useSound = () => {
    const [sound, setSound] = useState<Audio.Sound>();

    const playCreak = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/creak.mp3')
            );
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.log("Error playing sound:", error);
        }
    };

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    return { playCreak };
}

export default useSound;