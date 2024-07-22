import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase.js';

let artists = [];

const memberData = [
  { id: 'TING-YAO', name: '美國人' },
  { id: 'TZU-YUN', name: '潮州人' },
  { id: 'YUAN-JIE', name: '日本人' },
  { id: 'SIEW-FUI', name: '馬來人' },
  { id: 'YU-CHUN', name: '新竹人' },
  { id: 'CHEN-CHIH', name: '中國人' },
  { id: 'SHAO-TING', name: '天龍人' },
  { id: 'CHING-HSUAN', name: '台中人' },
];

export async function getArtists() {
  try {
    const colRef = collection(db, 'artists');
    const colSnapshot = await getDocs(colRef);
    const data = colSnapshot.docs.map((doc) => doc.data());
    artists = data;
    return data;
  } catch (error) {
    console.error('Failed to get events data: ', error);
  }
}

export function appendMember(target, memberId = '', memberName = '') {
  let p = document.createElement('p');
  p.append(memberName);
  p.dataset.id = memberId;
  p.style = 'color: black; font-size: 0.8rem; margin: 0.2rem 0;';
  target.append(p);
}

export async function addMember(artistId, target) {
  try {
    const userId = document.getElementById('current-member').value;
    const existedArtist = artists.find((artist) => artist.id === artistId);
    const newData = existedArtist
      ? { ...existedArtist, members: [...existedArtist.members, userId] }
      : { id: artistId, members: [userId] };

    const member = memberData.find((member) => member.id === userId);
    appendMember(target, member.id, member.name);

    const newArtists = existedArtist
      ? artists.map((artist) => (artist.id === artistId ? newData : artist))
      : [...artists, newData];
    artists = newArtists;

    const docRef = doc(db, 'artists', artistId);
    await setDoc(docRef, newData);
  } catch (error) {
    console.error('Failed to submit event data: ', error);
  }
}

export async function removeMember(artistId, target) {
  try {
    const userId = document.getElementById('current-member').value;
    const existedArtist = artists.find((artist) => artist.id === artistId);
    const newData = {
      ...existedArtist,
      members: existedArtist.members.filter((member) => member !== userId),
    };

    const targetChild = target.querySelector(`[data-id="${userId}"]`);
    target.removeChild(targetChild);

    const newArtists = artists.filter((artist) => artist.id !== artistId);
    artists = newArtists;

    const docRef = doc(db, 'artists', artistId);
    await setDoc(docRef, newData);
  } catch (error) {
    console.error('Failed to submit event data: ', error);
  }
}

export function toggleMember(artistId, target) {
  const selectedArtist = artists.find((artist) => artist.id === artistId);
  const userId = document.getElementById('current-member').value;
  const memberExisted =
    selectedArtist && selectedArtist.members.includes(userId);

  if (memberExisted) {
    removeMember(artistId, target);
  } else {
    addMember(artistId, target);
  }
}
