import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Mining = () => {
    const [totalMiningSpeed, setTotalMiningSpeed] = useState(0);
    const [baseMiningRate, setBaseMiningRate] = useState(0);
    const [boosterInfo, setBoosterInfo] = useState('');
    const [rewardInfo, setRewardInfo] = useState('');

    useEffect(() => {
        fetchMiningData();
    }, []);

    const fetchMiningData = async () => {
        try {
            // Replace with your API endpoints
            const speedResponse = await fetch('/api/mining/speed');
            const speedData = await speedResponse.json();
            setTotalMiningSpeed(speedData.speed);

            const rateResponse = await fetch('/api/mining/rate');
            const rateData = await rateResponse.json();
            setBaseMiningRate(rateData.rate);

            const boosterResponse = await fetch('/api/mining/booster');
            const boosterData = await boosterResponse.json();
            setBoosterInfo(boosterData.info);

            const rewardResponse = await fetch('/api/mining/reward');
            const rewardData = await rewardResponse.json();
            setRewardInfo(rewardData.info);
        } catch (error) {
            console.error('Error fetching mining data:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mining Dashboard</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Total Mining Speed</Text>
                <Text>{totalMiningSpeed} H/s</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Base Mining Rate</Text>
                <Text>{baseMiningRate} H/s</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Booster Information</Text>
                <Text>{boosterInfo}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reward Information</Text>
                <Text>{rewardInfo}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default Mining; 