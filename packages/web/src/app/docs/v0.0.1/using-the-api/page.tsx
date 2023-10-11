"use client";
import Loader from "~/components/common/loader";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

const pythonCode = (
  tokenUrl: string,
  apiUrl: string,
  clientId: string,
  clientSecret: string,
) => `
  """
  Sample Python script to get an access token using the client credentials grant and then use that token to make a request to the API.
  Requires the requests and base64 libraries.
  Copy/paste this code into a file called main.py and run it with 'python3 main.py'
  """
  
  import base64
  import requests
  
  TOKEN_URL = "${tokenUrl}/oauth2/token"
  API_URL = "${apiUrl}"
  CLIENT_ID = "${clientId}"
  CLIENT_SECRET = "${clientSecret}"
  
  access_token = requests.post(
      TOKEN_URL,
      data={
          "grant_type": "client_credentials",
          "scope": "t4/items:write",
          "client_id": CLIENT_ID,
          "client_secret": CLIENT_SECRET,
      },
      headers={
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic "
          + str(
              base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode("utf-8")), "utf-8"
          ),
      },
      timeout=10,
  ).json()["access_token"]
  
  # Example POST request to the API
  response = requests.post(
      API_URL + "/api/v0.0.1/items",
      json={
          "Imei": "505011234567890",
      },
      headers={
          "Content-Type": "application/json",
          "Authorization": "Bearer " + access_token,
      },
      timeout=10,
  )
  
  print(response.json())
  `;

export default function Page() {
  const tokenUrl = api.apps.getCognitoDomain.useQuery();
  const apiUrl = api.apps.getApiUrl.useQuery();

  if (tokenUrl.isLoading || apiUrl.isLoading) {
    return <Loader text="Loading..." />;
  }

  if (tokenUrl.isError || apiUrl.isError) {
    return <div>Error</div>;
  }

  const code = pythonCode(
    tokenUrl.data,
    apiUrl.data,
    "REPLACE_ME",
    "REPLACE_ME",
  );
  return (
    <div>
      <div className="my-5">
        <h1 className="text-3xl font-semibold">Using the API</h1>
      </div>

      {/* Python */}
      <h2 className="text-xl font-semibold">Python Sample</h2>
      {/* copy to clipboard */}
      <div className="mockup-code text-xs">
        <button
          className="absolute right-0 top-0 p-2 text-xs text-gray-500 hover:text-gray-900"
          onClick={() => {
            toast.success("Copied to clipboard");
            void navigator.clipboard.writeText(code);
          }}
        >
          Copy to clipboard
        </button>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
