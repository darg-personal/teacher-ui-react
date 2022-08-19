import React from "react";
import './chat.css'
function Chat() {
  return (
<>
<div class="sidebar">
<a className="active" href="#home">
<img
  src="https://www.w3schools.com/howto/img_avatar.png"
  alt="Avatar"
  className="avatar"
/>
Sanjay Rajput
</a>
<a href="#news">
<img
  src="https://www.w3schools.com/howto/img_avatar2.png"
  alt="Avatar"
  className="avatar"
/>
Anmol Rajput
</a>
<a href="#contact">
<img
  src="https://www.w3schools.com/w3images/avatar2.png"
  alt="Avatar"
  className="avatar"
/>
Rahul vishwakrma
</a>
<a href="#about">
<img
  src="https://www.w3schools.com/w3images/avatar6.png"
  alt="Avatar"
  className="avatar"
/>
Yogita tomar
</a>
<a href="#about">
<img
  src="https://www.w3schools.com/w3images/avatar6.png"
  alt="Avatar"
  className="avatar"
/>
Chetan vishwakrma
</a>
<a href="#about">
<img
  src="https://www.w3schools.com/howto/img_avatar.png"
  alt="Avatar"
  className="avatar"
/>
Vikas
</a>
<a href="#about">
<img
  src="https://www.w3schools.com/w3images/avatar6.png"
  alt="Avatar"
  className="avatar"
/>
Muskan Yadav
</a>
<a href="#about">
<img
  src="https://www.w3schools.com/howto/img_avatar.png"
  alt="Avatar"
  className="avatar"
/>
Devraj vishwakrma
</a>
<a href="#about">
<img
  src="https://www.w3schools.com/w3images/avatar6.png"
  alt="Avatar"
  className="avatar"
/>
Harsh vishwakrma
</a>
</div>


<div class="content">

<div>
Lorem ipsuque veritatis deserunt doloremque id, illo esse, aut animi iusto autem modi consequatur odit accusantium saepe dicta molestias assumenda rerum et voluptatibus aperiam aliquamaliquid deleniti illo cum odit, reprehenderit error tempora, commodi ducimus aspernatur nostrum dolorum a neque rem minima. Rem minus magnam praesentium laudantium libero nisi veritatis eius dignissimos. Debitis molestias veritatis soluta, corrupti dolorum nisi, laborum culpa dolores alias in velit consequatur quam fugit! A nam magni amet recusandae laboriosam, quam ullam doloribus itaque neque nihil voluptates corporis minus hic molestiae inventore beatae odio culpa tempora suscipit natus quod. Assumenda, quod est. Aut, ipsa?
Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem natus ex consectetur porro et qui sapiente nesciunt iste aliquam consequatur odit harum laudantium hic exercitationem enim suscipit, officiis vitae! Provident et quae ex voluptas architecto itaque, voluptates explicabo neque temporibus vel ipsum beatae voluptatum, consequatur fuga ea fugiat molestiae, enim eius recusandae eos dolorum delectus. Labore, reprehenderit! Culpa ducimus tempore deleniti corrupti unde atque accusantium nulla? Iste error hic dolores mollitia unde dolorum eligendi expedita nulla ullam dolore fugiat quas ratione, nesciunt illum suscipit pariatur eum. Quia, vero hic? Vel quia magnam doloremque nihil eaque vitae tenetur tempora velit quae.
lorem1000
    </div>


    <div className="footer">
        <input type="text"  placeholder="Enter Text"/>

        <button>send</button>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          fill="currentColor"
          className="bi bi-mic-fill"
          viewBox="0 0 16 16"
        >
          <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          fill="currentColor"
          className="bi bi-heart"
          viewBox="0 0 16 16"
        >
          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          fill="currentColor"
          className="bi bi-image"
          viewBox="0 0 16 16"
        >
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
        </svg>
 
    </div>
</div>
</>
  );
}

export default Chat;
