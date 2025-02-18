import NavBar from 'components/NavBar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchData } from '../utils/api';

const Home = ({ userToken, username, setUserToken, handleLogout }: { userToken: string | null; username: string | null; setUserToken: (token: string | null) => void; handleLogout: () => void }) => {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userImage, setUserImage] = useState<string | null>(null);

	useEffect(() => {
		if (userToken) {
			setIsLoggedIn(true);
			fetchData('users', userToken)
				.then(data => {
					const currentUser = data.users.find((user: any) => user.username === username);
					setUserImage(currentUser?.image || null);
				})
				.catch(error => {
					console.error('Error fetching user data:', error);
				});
		} else {
			setIsLoggedIn(false);
		}
	}, [userToken, username]);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
			<NavBar isLoggedIn={isLoggedIn} username={username || ''} handleLogout={handleLogout} userImage={userImage} />
			<div className={"container-fluid"}>
				<div>Welcome to the Home Page</div>
				<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in mauris non tellus dignissim lobortis quis at arcu. Nulla eu luctus leo. Pellentesque at turpis lorem. Praesent euismod sollicitudin odio, sed facilisis nisi aliquam at. Curabitur posuere dui a lorem facilisis tempor. Nunc tristique pellentesque nibh. Aliquam nisl purus, mollis in sollicitudin id, imperdiet vitae nisl. Quisque varius ut libero eu malesuada. Mauris mauris orci, convallis ac vestibulum at, porta eu orci.<br/><br/>Etiam eleifend velit in eros pharetra posuere. Praesent lectus purus, fringilla vitae orci a, pellentesque pretium turpis. Etiam varius ipsum quis vestibulum consectetur. Proin faucibus magna vitae arcu convallis dictum. Sed pretium, felis nec venenatis facilisis, libero nisi pretium dui, sed sagittis metus felis vitae enim. Integer viverra lorem et lacus condimentum, ut tristique augue varius. In elementum eros nisl, sed ultrices ipsum consequat aliquam.<br/><br/>Duis sit amet magna non purus suscipit dapibus. Sed sed ex lectus. Ut fermentum nulla ac justo dignissim posuere. Morbi vel nisl quam. Sed commodo neque non faucibus consequat. Donec congue placerat nulla id ultricies. Nullam tempor efficitur nisl in convallis. Curabitur a suscipit nisl, at faucibus dolor. Praesent venenatis enim at nisi aliquet, id consectetur sapien ultricies. Mauris ut justo tellus. Aenean suscipit diam non ligula consequat, eu dapibus leo ornare.<br/><br/>Cras at odio id dui placerat efficitur. Nullam ac vulputate velit, nec ullamcorper diam. Proin at lectus mauris. Donec laoreet erat sed sapien tristique, sed suscipit nibh pellentesque. Nullam mattis elit ac turpis dictum, vitae molestie turpis sodales. Ut sit amet turpis vehicula, dictum mi sit amet, feugiat nulla. Quisque tempus commodo turpis et facilisis. Pellentesque sed sem ut augue semper finibus quis ut nunc. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus consequat neque purus, a sagittis tortor laoreet vel. Mauris sit amet arcu nec augue scelerisque consequat. Donec in elementum leo. Sed pellentesque mauris sit amet ipsum rhoncus elementum. Donec gravida feugiat turpis a pulvinar. Morbi non consequat nunc, eget ultrices ex.<br/><br/>Curabitur facilisis interdum velit quis iaculis. Maecenas aliquam est quis blandit venenatis. In nec velit vel elit egestas blandit. Sed sit amet elit quis tortor laoreet varius nec vitae lacus. Nullam in elit vel diam ullamcorper ultricies. Phasellus efficitur molestie risus, ut porttitor urna placerat a. Proin auctor scelerisque purus, eu consectetur nulla scelerisque a. Duis purus lacus, tincidunt id felis id, varius porttitor ex.</div>
			</div>
		</div>
	);
};

export default Home;