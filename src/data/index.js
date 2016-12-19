// /data/index.js

const videoA = {
    id: 'a',
    title: 'Create a GraphQl Schema',
    duration: 120,
    watched: true,
    released: true,
};

const videoB = {
    id: 'b',
    title: 'Ember.js CLI',
    duration: 240,
    watched: false,
    released: true,
};

const videos = [videoA, videoB];

const getVideoById = (id) => new Promise( (resolve) => {
    const [video] = videos.filter( (video) => {
        return video.id === id;
    });
    resolve(video);
});
exports.getVideoById = getVideoById;

const getVideos = () => new Promise( (resolve) => {
    resolve(videos);
});
exports.getVideos = getVideos;

const createVideo = ({title , duration, released}) => {
    const video = {
        id: (new Buffer(title, 'utf8')).toString('base64'),
        title,
        duration,
        watched: false,
        released,
    };
    videos.push(video);
    return video;
};
exports.createVideo = createVideo;


