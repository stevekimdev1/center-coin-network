import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchFaqs();
    }, [currentPage, searchTerm]);

    const fetchFaqs = async () => {
        try {
            // Replace with your API endpoint
            const response = await fetch(`/api/faqs?page=${currentPage}&search=${searchTerm}`);
            const data = await response.json();
            setFaqs(data.faqs);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>FAQ Page</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Search FAQs..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            {faqs.map((faq) => (
                <View key={faq.id} style={styles.faqItem}>
                    <Text style={styles.question}>{faq.question}</Text>
                    <Text>{faq.answer}</Text>
                </View>
            ))}
            <View style={styles.pagination}>
                <Button title="Previous" onPress={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                <Text>Page {currentPage} of {totalPages}</Text>
                <Button title="Next" onPress={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
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
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    faqItem: {
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
    question: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
});

export default FAQ; 