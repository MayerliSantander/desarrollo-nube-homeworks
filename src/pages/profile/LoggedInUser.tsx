import Button from "../../components/Button";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import Card from "../../components/Card";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import { useFirebaseNotifications } from "../../hooks/useFirebaseNotifications";

export const LoggedInUser = () => {
  const navigate = useNavigate();
  const { user, logout } = useFirebaseUser();
  const { token } = useFirebaseNotifications();
  const [userHasGoogle, setUserHasGoogle] = useState(false);
  const [userHasPassword, setUserHasPassword] = useState(false);
  const [userHasFacebook, setUserHasFacebook] = useState(false);
  const { linkWithFacebook } = useFirebaseUser();
  const [userHasPhone, setUserHasPhone] = useState(false);
  
  useEffect(() => {
    console.log("Firebase token:", token);
  }, [token]);

  useEffect(() => {
    if (!user) {
      return;
    }
    // Check if the user has Google as a provider
    const hasGoogle = user.providerData.some(
      (profile) => profile.providerId === "google.com"
    );
    setUserHasGoogle(hasGoogle);
    // Check if the user has email/password as a provider
    const hasPassword = user.providerData.some(
      (profile) => profile.providerId === "password"
    );
    setUserHasPassword(hasPassword);
    // for (const profile of user.providerData) {
    //   console.log("Provider ID:", profile.providerId);
    // }

    const hasFacebook = user.providerData.some(
      (profile) => profile.providerId === "facebook.com"
    );
    setUserHasFacebook(hasFacebook);

    const hasPhone = user.providerData.some(
      (profile) => profile.providerId === "phone"
    );
    setUserHasPhone(hasPhone);
  }, [user]);
  const onAddEmailSignInClicked = () => {
    navigate("/linkpassword");
  };
  const onAddFacebookSignInClicked = () => {
    linkWithFacebook();
  };

  const onAddPhoneSignInClicked = () => {
    navigate("/phonecheck");
  };

  return (
    <>
      <Card>
        <div>
          <h1>Welcome to the dashboard {user?.displayName}!</h1>
          <div>
            <b>Your email is:</b> {user?.email}
          </div>
          <div>
            Add additional login methods:
            {!userHasGoogle && (
              <div>
                <Button variant="danger" className="mt-3" onClick={() => {}}>
                  Add google Sign In
                </Button>
              </div>
            )}
            {!userHasPassword && (
              <div>
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={onAddEmailSignInClicked}
                >
                  Add email Sign In
                </Button>
              </div>
            )}
            {!userHasFacebook && (
              <div>
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={onAddFacebookSignInClicked}
                >
                  Add Facebook Sign In
                </Button>
              </div>
            )}
            {!userHasPhone && (
              <div>
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={onAddPhoneSignInClicked}
                >
                  Add Phone details
                </Button>
              </div>
            )}
          </div>
        </div>
        <div>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </div>
      </Card>
    </>
  );
};
