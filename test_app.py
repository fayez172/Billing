import requests
import time

# Test the application endpoints
def test_app():
    base_url = "http://localhost:8080"
    api_url = "http://localhost:8080/api"
    
    print("Testing Teleradiology Billing Application")
    print("=" * 50)
    
    # Test frontend access
    try:
        response = requests.get(base_url)
        print(f"Frontend access: {'✓' if response.status_code == 200 else '✗'} (Status: {response.status_code})")
    except Exception as e:
        print(f"Frontend access: ✗ (Error: {str(e)})")
    
    # Test API health endpoint
    try:
        response = requests.get(f"{api_url}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"API health check: ✓ (Status: {data.get('status')})")
        else:
            print(f"API health check: ✗ (Status: {response.status_code})")
    except Exception as e:
        print(f"API health check: ✗ (Error: {str(e)})")
    
    # Test clients endpoint
    try:
        response = requests.get(f"{api_url}/clients")
        if response.status_code == 200:
            data = response.json()
            print(f"Clients endpoint: ✓ (Found {len(data)} clients)")
        else:
            print(f"Clients endpoint: ✗ (Status: {response.status_code})")
    except Exception as e:
        print(f"Clients endpoint: ✗ (Error: {str(e)})")
    
    # Test mappings endpoint
    try:
        response = requests.get(f"{api_url}/mappings")
        if response.status_code == 200:
            data = response.json()
            print(f"Mappings endpoint: ✓ (Found {len(data)} mappings)")
        else:
            print(f"Mappings endpoint: ✗ (Status: {response.status_code})")
    except Exception as e:
        print(f"Mappings endpoint: ✗ (Error: {str(e)})")
    
    print("=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    test_app()