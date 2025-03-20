import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [coinSymbol, setCoinSymbol] = useState('');
    const [coinRate, setCoinRate] = useState(0);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            // Replace with your API endpoints
            const balanceResponse = await fetch('/api/wallet/balance');
            const balanceData = await balanceResponse.json();
            setBalance(balanceData.amount);
            setCoinSymbol(balanceData.symbol);
            setCoinRate(balanceData.rate);

            const transactionsResponse = await fetch('/api/wallet/transactions');
            const transactionsData = await transactionsResponse.json();
            setTransactions(transactionsData);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Wallet</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Balance</Text>
                <View style={styles.balanceContainer}>
                    <Image source={{ uri: `/images/${coinSymbol}.png` }} style={styles.coinImage} />
                    <Text>{balance} {coinSymbol} @ {coinRate} USD</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Transaction History</Text>
                {transactions.map((transaction) => (
                    <View key={transaction.id} style={styles.transactionItem}>
                        <Text>{transaction.date}: {transaction.amount} {coinSymbol} - {transaction.type}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.section}>
                <Button title="Send" onPress={() => alert('Send functionality not implemented yet')} />
                <Button title="Receive" onPress={() => alert('Receive functionality not implemented yet')} />
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
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinImage: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    transactionItem: {
        marginBottom: 10,
    },
});

export default Wallet;
