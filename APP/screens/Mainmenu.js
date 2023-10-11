import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Product = ({ title, description, price }) => (
  <View style={styles.productContainer}>
    <Image
      source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fullaccezz-2756a.appspot.com/o/products%2FBillionarie%20Margarita%20.jpg?alt=media&token=14b18944-2f41-4f50-9394-aeec7d855fac' }}
      style={styles.productImage}
      resizeMode="contain"
    />
    <Text style={styles.productTitle}>{title}</Text>
    <Text style={styles.productDescription}>{description}</Text>
    <Text style={styles.productPrice}>{price}</Text>
  </View>
);

const MyApp = () => {
  const [searchText, setSearchText] = React.useState('');

  const products = [
    { title: "Cocktail", description: "A delightful mix of flavors.", price: "$18" },
    // ... (You can add more products here if needed)
  ];

  const categories = [
    { name: 'Margaritas', products: products },
    { name: 'Cocktails', products: products },
    { name: 'Red Wine by the Glass', products: products },
    { name: 'White Wine by the Glass', products: products }
  ];

  const filteredCategories = categories.filter(category => {
    if (category.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }
    return category.products.some(product => 
      product.title.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: 'https://cantinala20.com/wp-content/uploads/2021/09/logo_white.png' }} style={styles.logo} />
      </View>
      <View style={styles.topBar}>
        <Text style={styles.headerText}> Hello Alvaro,</Text>
        <Button title="All Menus" onPress={() => console.log("All Menus pressed")} />
        <Button title="Share" onPress={() => console.log("Share pressed")} />
        <Button title="☰" onPress={() => console.log("Hamburger Menu pressed")} />
      </View>
      <View style={styles.searchBarContainer}>
        <Text style={styles.headerText}> This is your drink menu</Text>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search..." 
          placeholderTextColor="#aaa" 
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <ScrollView>
        {filteredCategories.map((category, index) => (
          <View key={index}>
            <Text style={styles.categoryText}>{category.name}</Text>
            <View style={styles.content}>
              {[...Array(5)].map((_, i) => (
                <Product key={i} title="Cocktail" description="A delightful mix of flavors." price="$18" />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
    productContainer: {
        marginBottom: 20,
        alignItems: 'center',
        width: width * 0.5 - 16,
      },
      productImage: {
        width: 263,
        height: 174,
      },
      productTitle: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 17,
        color: '#FFF',
      },
      productDescription: {
        fontSize: 8,
        fontWeight: '500',
        lineHeight: 8,
        color: '#FFF',
      },
      productPrice: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 24,
        color: '#FFF',
      },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
  },
  welcomeContainer: {
    padding: 10,
    alignItems: 'flex-start',
  },
  headerText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.165,
    textAlign: 'left',
    marginBottom: 0, 
},
  searchBarContainer: {
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    paddingLeft: 10,
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 26,
    fontWeight: '500',
    marginBottom: 10,
    color: '#FFF',
  }
});


export default MyApp;
