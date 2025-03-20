import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Home = () => {
    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.header}>Mining Status</Text>
                <Text>Current mining status: Active</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.header}>Wallet Balance</Text>
                <Text>Your balance: 0.00 BTC</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.header}>Referral Count</Text>
                <Text>You have referred: 5 friends</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.header}>Advertisement</Text>
                <Button title="Watch Ad" onPress={() => alert('Playing Ad...')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
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
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default Home;