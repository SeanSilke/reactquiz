
var exapmle =  "./stat.n/save?q0=1&q1=2&q2=0&q3=1&q4=2"


const  user_answers = [10,77,9,456,3];

url = (arr) => arr.map((v,i)=> "q" + i + "="+v ).join("&")



console.log(url(user_answers))
