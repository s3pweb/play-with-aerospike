local function one(rec)
    return rec.speed.value;
end

local function add(a, b)
    return math.max(a,b);
end

function max(stream)
    return stream : map(one) : reduce(add);
end