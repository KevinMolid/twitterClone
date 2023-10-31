// Imports

import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { tweetsData } from './data.js'

// Event listeners

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    } 
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})


// Functions

function handleReplyClick(tweetId){
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
    document.getElementById(`comment-${tweetId}`).classList.toggle('hidden')
}

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}


function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        // Make new tweet object
        const newTweet = {
            handle: `@KevinMolid 👑`,
            profilePic: `images/Kevin.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: `${tweetInput.value}`,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        }

        // Add tweet object to array
        tweetsData.unshift(newTweet)

        // Clear input field
        tweetInput.value = ''
        render()
    }
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let repliesHTML = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHTML += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }
        
          
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHTML}
                </div> 
                <div class="hidden comment" id="comment-${tweet.uuid}">
                    <textarea 
                    class="comment-input"
                        id="input-${tweet.uuid}"
                        placeholder="Write a comment..."></textarea>
                    <button 
                        class="comment-btn"
                        id="${tweet.uuid}-btn">Publish</button>
                </div>
            </div>
            `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    for (let tweet of tweetsData){
        const input = document.getElementById(`input-${tweet.uuid}`)
        
        document.getElementById(`${tweet.uuid}-btn`).addEventListener('click', function(){

            if(input.value){
                tweet.replies.push(
                    {
                        handle: `@KevinMolid 👑`,
                        profilePic: `images/Kevin.jpg`,
                        tweetText: input.value,
                    },
                )
                render()
            }
        })
    }
}


// Run

render()

