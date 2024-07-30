import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';

export default function App() {
  const [log, setLog] = useState('');
  const [parsedLogs, setParsedLogs] = useState([]);
  const [parsingComplete, setParsingComplete] = useState(false);

  const handleInputChange = (text) => {
    setLog(text);
    const parsed = parseLog(text);
    setParsedLogs(parsed);
    setParsingComplete(true); // Indicate that parsing is complete
  };

  const parseLog = (text) => {
    // Split the input text into log entries
    const logEntries = text.split('\n').filter(entry => entry.trim() !== '');

    // Define the regular expression pattern for parsing Nginx logs
    const logPattern = /^(?<ip>\S+) - - \[(?<timestamp>[^\]]+)] "(?<request>[^"]+)" (?<status>\d{3}) (?<size>\d+) "(?<referer>[^"]*)" "(?<agent>[^"]*)"/;

    // Parse each log entry
    return logEntries.map((entry, index) => {
      const match = entry.match(logPattern);
      if (match) {
        const { ip, timestamp, request, status, size, referer, agent } = match.groups;
        const [method, url, httpVersion] = request.split(' ');
        return { 
          id: index.toString(), 
          entry, 
          pattern: logPattern.toString(), 
          ip, 
          timestamp, 
          method, 
          url, 
          httpVersion, 
          status, 
          size, 
          referer, 
          agent 
        };
      }
      return { 
        id: index.toString(), 
        entry, 
        pattern: logPattern.toString(), 
        ip: 'Invalid Entry', 
        timestamp: '', 
        method: '', 
        url: '', 
        httpVersion: '', 
        status: '', 
        size: '', 
        referer: '', 
        agent: entry.trim() 
      };
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Nginx logs:</Text>
      <Text style={styles.pattern}>
        Pattern: {"{IP} - - [TIMESTAMP] \"METHOD URL HTTPVERSION\" STATUS SIZE \"REFERER\" \"USERAGENT\""}
      </Text>
      <TextInput
        style={styles.input}
        value={log}
        onChangeText={handleInputChange}
        placeholder="Enter logs"
        multiline
      />
      <ScrollView style={styles.scrollView}>
        {parsedLogs.map((logEntry) => (
          <View key={logEntry.id} style={styles.logEntry}>
            <Text style={styles.logText}><Text style={styles.logLabel}>Raw Log:</Text> {logEntry.entry}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>Pattern:</Text> {logEntry.pattern}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>IP:</Text> {logEntry.ip}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>Timestamp:</Text> {logEntry.timestamp}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>Method:</Text> {logEntry.method}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>URL:</Text> {logEntry.url}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>HTTP Version:</Text> {logEntry.httpVersion}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>Status:</Text> {logEntry.status}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>Size:</Text> {logEntry.size}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>Referer:</Text> {logEntry.referer}</Text>
            <Text style={styles.logText}><Text style={styles.logLabel}>User Agent:</Text> {logEntry.agent}</Text>
          </View>
        ))}
        {parsingComplete && <Text style={styles.completeMessage}>Parsing Complete</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  pattern: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
    color: 'gray',
  },
  input: {
    height: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  scrollView: {
    width: '100%',
  },
  logEntry: {
    marginBottom: 10,
  },
  logText: {
    fontSize: 14,
    marginBottom: 2,
  },
  logLabel: {
    fontWeight: 'bold',
  },
  completeMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 20,
  },
});
