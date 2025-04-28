import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Select, Rate, Tag, Spin, Empty } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Option } = Select;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [cuisine, setCuisine] = useState('all');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // This would be your actual API call
        const response = await fetch('/api/restaurants');
        const data = await response.json();
        
        setRestaurants(data);
        setFilteredRestaurants(data);
        
        // Extract unique cuisines for filter options
        const cuisineSet = new Set();
        data.forEach(restaurant => {
          restaurant.cuisines.forEach(cuisine => {
            cuisineSet.add(cuisine);
          });
        });
        setCuisineOptions(Array.from(cuisineSet));
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Filter restaurants based on search text and cuisine
    const filtered = restaurants.filter(restaurant => {
      const matchesSearch = 
        restaurant.name.toLowerCase().includes(searchText.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCuisine = 
        cuisine === 'all' || 
        restaurant.cuisines.includes(cuisine);
      
      return matchesSearch && matchesCuisine;
    });
    
    setFilteredRestaurants(filtered);
  }, [searchText, cuisine, restaurants]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Restaurants</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search restaurants..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="md:w-1/2"
        />
        
        <div className="flex items-center">
          <FilterOutlined className="mr-2" />
          <span className="mr-2">Cuisine:</span>
          <Select
            value={cuisine}
            onChange={setCuisine}
            style={{ width: 200 }}
          >
            <Option value="all">All Cuisines</Option>
            {cuisineOptions.map(cuisine => (
              <Option key={cuisine} value={cuisine}>{cuisine}</Option>
            ))}
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredRestaurants.map(restaurant => (
            <Col xs={24} sm={12} md={8} lg={6} key={restaurant.id}>
              <Link to={`/restaurants/${restaurant.id}`}>
                <Card
                  hoverable
                  cover={
                    <img 
                      alt={restaurant.name} 
                      src={restaurant.imageUrl || "/api/placeholder/400/250"} 
                      className="h-48 object-cover"
                    />
                  }
                  className="h-full flex flex-col"
                >
                  <Meta 
                    title={restaurant.name} 
                    description={restaurant.description.substring(0, 60) + '...'}
                  />
                  <div className="mt-2">
                    <Rate disabled defaultValue={restaurant.rating} className="text-sm" />
                    <span className="ml-2 text-gray-600">
                      ({restaurant.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="mt-2">
                    {restaurant.cuisines.map(cuisine => (
                      <Tag key={cuisine} className="mb-1">{cuisine}</Tag>
                    ))}
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="No restaurants found matching your search"
          className="my-16"
        />
      )}
    </div>
  );
};

export default Restaurants;