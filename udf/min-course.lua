local function _aggregate(aggregate, rec)

    if aggregate == nil then
        aggregate = rec.course.value
  
    elseif aggregate > rec.course.value then
     aggregate = rec.course.value
    end
    
    return aggregate;
end

local function _reduce(a, b)
    return a;
end


function min(stream)
    return stream : aggregate(nil, _aggregate): reduce(_reduce);
end